import { addAuthHeader } from "@/lib/utils";
import { toast } from "sonner";

export const queryEDiscovery = async (
  query,
  files,
  onMessage,
  onError,
  onComplete,
  abortController
) => {
  try {
    if (!query || typeof query !== "string") {
      return onError("Invalid query. Please provide a valid text query.");
    }
    if (!files || !Array.isArray(files) || files.length === 0) {
      return onError("Please provide at least one file for eDiscovery.");
    }

    // 🔹 Upload Files + Query in ONE Request
    const formData = new FormData();
    formData.append("query", query);
    files.forEach((file) => formData.append("files", file)); // Append multiple files

    // 🔹 Get auth headers
    const authHeader = addAuthHeader();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/ediscovery`,
      {
        method: "POST", // Change to POST since we're sending files
        credentials: "include",
        body: formData,
        headers: {
          Accept: "text/event-stream", // Expecting SSE
          ...authHeader, // 🔥 Spread token header dynamically
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
    console.error("Query eDiscovery Error:", error);
    onError(error.message || "Failed to fetch response.");
  }
};

export const fetchEDRecentChats = async (user, edChats, overrideEDChats) => {
  if (edChats.length === 0 && user) {
    // 🔹 Get auth headers
    const authHeader = addAuthHeader();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/ediscovery/fetch-recent-chats?userId=${user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...authHeader, // 🔥 Spread token header dynamically
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Server failed with status ${res.status}`);
      }

      const { chats } = await res.json();
      const recentChats = chats.slice(-50); // extra safety

      overrideEDChats(recentChats);
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
