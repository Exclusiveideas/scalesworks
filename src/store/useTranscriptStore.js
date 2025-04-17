import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_CHAT_HISTORY = 50;
 
const useTranscriptionStore = create(
  persist(
    (set) => ({
      tChats: [],
      updateTChats: (newChat) =>
        set((state) => {
          const updatedChats = [...state.tChats, newChat];
          // Keep only the last 50 messages
          const limitedChats = updatedChats.slice(-MAX_CHAT_HISTORY);
          return { tChats: limitedChats };
        }),
      clearTChats: () => set({ tChats: [] }),
    }),
    {
      name: "scaleworks-transcription-chats",
    }
  )
);

export default useTranscriptionStore;