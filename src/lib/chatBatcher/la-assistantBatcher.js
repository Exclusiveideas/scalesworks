import { addAuthHeader } from "../utils";

let chatQueue = [];
let isFlushing = false;
let intervalStarted = false;

// Flush queued chats to the server in batch
async function flushChatQueueToDB() {
  if (isFlushing || chatQueue.length === 0) return;

  isFlushing = true;
  const messagesToSend = chatQueue.slice();
  chatQueue.length = 0;

  // 🔹 Get auth headers
  const authHeader = addAuthHeader();

  try {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/legal-research/batch-save-chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader, // 🔥 Spread token header dynamically
      },
      body: JSON.stringify({ chats: messagesToSend }),
    });
  } catch (error) {
    console.error("Batch save failed:", error);
    // Re-queue messages if the request fails
    chatQueue.unshift(...messagesToSend);
  } finally {
    isFlushing = false;
  }
}

// Start the periodic flush interval
function startFlushInterval() {
  if (intervalStarted) return;
  intervalStarted = true;

  setInterval(() => {
    flushChatQueueToDB();
  }, 10000); // flush every 10 seconds
}

// Public: Add a chat message to the queue
export function queueLAChatForDB(chat) {
  chatQueue.push(chat);
  startFlushInterval();
}

// Optional: expose a manual flush if needed
export function manualLAFlush() {
  return flushChatQueueToDB();
}
