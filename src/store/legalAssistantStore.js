import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_CHAT_HISTORY = 50; 

const useLegalAssistStore = create(
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
      overrideChats: (dbChats) => set(() => ({ chats: [...dbChats] })),
      clearChats: () => set({ chats: [] }),
    }),
    {
      name: "scaleworks-legal-assistant-chats",
    }
  )
);

export default useLegalAssistStore;
