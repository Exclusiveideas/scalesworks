import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLegalAssistStore = create(
  persist(
    (set) => ({
      chats: [],
      updateChats: (newChat) => set((state) => ({ chats: [...state.chats, newChat] })),
      clearChats: () => set({ chats: [] }),
    }),
    {
      name: "legal-assistant-chats",
    }
  )
);

export default useLegalAssistStore;