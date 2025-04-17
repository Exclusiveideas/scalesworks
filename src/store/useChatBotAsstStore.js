import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_CHAT_HISTORY = 50; 

const useChatBotAsstStore = create(
  persist(
    (set) => ({
      chats: [],
      updateChats: (newChat) =>
        set((state) => {
          const updatedChats = [...state.chats, newChat];
          // Keep only the last 50 messages
          const limitedChats = updatedChats.slice(-MAX_CHAT_HISTORY);
          return { chats: limitedChats };
        }),
      clearChats: () => set({ chats: [] }),
    }),
    {
      name: "scaleworks-chatBot-assistant-chats",
    }
  )
);

export default useChatBotAsstStore;