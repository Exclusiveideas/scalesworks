import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTranscriptionStore = create(
  persist(
    (set) => ({
      tChats: [],
      updateTChats: (newChat) => set((state) => ({ tChats: [...state.tChats, newChat] })),
      clearTChats: () => set({ tChats: [] }),
    }),
    {
      name: "scaleworks-transcription-chats",
    }
  )
);

export default useTranscriptionStore;