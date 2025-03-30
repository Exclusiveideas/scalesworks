export const queryTranscription = async (
  selectedAudio,
  onMessage,
  onError,
  onComplete,
  abortController
) => {
  try {
    if (!selectedAudio) {
      return onError("Please provide an audio file.");
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("audio", selectedAudio); // Append the file with key "audio"

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/transcription`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
        headers: {
          Accept: "text/event-stream", // Expect SSE
        },
        signal: abortController.signal, // Enables fetch cancellation
      }
    );

    if (!response.ok) {
      throw new Error(`${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let firstMessage = true; // Track if it's the first message

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let lines = buffer.split("\n\n"); // Split by SSE event boundary
      buffer = lines.pop(); // Keep last partial chunk for next iteration

      for (let event of lines) {
        if (!event.trim()) continue;

        const dataMatch = event.match(/data:\s*(.*)/);
        if (!dataMatch) continue;

        try {
          const parsedData = JSON.parse(dataMatch[1]); // Parse only the 'data' part

          if (parsedData.type === "ERROR") {
            return onError(parsedData.message);
          }

          if (parsedData.type === "SUCCESS") {
            onMessage(parsedData.message + ' '); // 🔹 Append only new message
          }

          if (parsedData.type === "END") {
            reader.cancel(); // Close the reader properly
            if (onComplete) onComplete();
            return; // Exit function
          }
        } catch (err) {
          console.error("Error parsing server response:", err);
          onError("Invalid response format.");
        }
      }
    }
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Fetch aborted.");
      return;
    }
    console.error("Query Transcription Error:", error);
    onError(error.message || "Failed to fetch response.");
  }
};
