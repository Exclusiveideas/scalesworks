import { addAuthHeader } from "@/lib/utils";

export const queryContractReview = async (files, onMessage, onError, onComplete, abortController) => {
    try {
        if (!files || !Array.isArray(files) || files.length === 0) {
            return onError("Please provide at least one file for eDiscovery.");
        }

        // 🔹 Upload Files in ONE Request
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file)); // Append multiple files
        
        // 🔹 Get auth headers
        const authHeader = addAuthHeader();

        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/contract-review`, {
            method: "POST",  // Change to POST since we're sending files
            credentials: "include",
            body: formData,
            headers: {
                "Accept": "text/event-stream", // Expecting SSE
                ...authHeader,  // 🔥 Spread token header dynamically
            },
            signal: abortController.signal, // Enables fetch cancellation
        });
        
        if (!response.ok) {
            throw new Error(`${response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            let lines = buffer.split("\n\n"); // Split by SSE event boundary
            buffer = lines.pop(); // Keep last partial chunk for next iteration

            for (let event of lines) {
                // if (!event.trim()) continue;

                const dataMatch = event.match(/data:\s*(.*)/);
                if (!dataMatch) continue;


                try {
                    const parsedData = JSON.parse(dataMatch[1]); // Parse only the 'data' part


                    if (parsedData.type === "ERROR") {
                        return onError(parsedData.message);
                    }

                    if (parsedData.type === "SUCCESS") {
                      let txtMessage = parsedData.message;
                      onMessage(txtMessage); // Append a line break to each message
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
        console.error("Query Contract review Error:", error);
        onError(error.message || "Failed to fetch response.");
    }
};
