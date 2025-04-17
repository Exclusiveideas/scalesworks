import { addAuthHeader } from "@/lib/utils";
import { toast } from "sonner";

export const queryLegalAssistant = async (
  query,
  onMessage,
  onError,
  onComplete,
  abortController
) => {
  try {
    if (!query || typeof query !== "string") {
      return onError("Invalid query. Please provide a valid text query.");
    }

    // 🔹 Get auth headers
    const authHeader = addAuthHeader();

    // 🔹 Open SSE Connection with AbortController
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_SERVER_URI
      }/legal-research?query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "text/event-stream", // Expecting SSE
          ...authHeader, // 🔥 Spread token header dynamically
        },
        signal: abortController.signal, // Enables fetch cancellation
      }
    );

    if (!response.ok) {
      throw new Error(`Server Error: ${response.statusText}`);
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
        if (!event.trim()) continue;

        const dataMatch = event.match(/data:\s*(.*)/);
        if (!dataMatch) continue;

        try {
          const parsedData = JSON.parse(dataMatch[1]); // Parse only the 'data' part

          if (parsedData.type === "ERROR") {
            return onError(parsedData.message);
          }

          if (parsedData.type === "SUCCESS") {
            onMessage(parsedData.message); // 🔹 Append only new message
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
    console.error("Query Legal Assistant Error:", error);
    onError(error.message || "Failed to fetch response.");
  }
};

export const fetchLARecentChats = async (user, laChats, overrideChats) => {
  if (laChats.length === 0 && user) {
    // 🔹 Get auth headers
    const authHeader = addAuthHeader();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/legal-research/fetch-recent-chats?userId=${user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Server failed with status ${res.status}`);
      }

      const { chats } = await res.json();
      const recentChats = chats?.slice(-50); // extra safety
      
      overrideChats(recentChats);
    } catch (err) {
      toast.error("Failed to fetch chats", {
        description: err.message || err,
        style: {
          border: "none",
          color: "red",
        },
      });
    }
  }
};
