import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_CHAT_HISTORY = 50;

const useDocumentAutomationStore = create(
  persist(
    (set) => ({
      dAChats: [],
      updateDAChats: (newChat) =>
        set((state) => {
          const updatedChats = [...state.dAChats, newChat];
          // Keep only the last 50 messages
          const limitedChats = updatedChats.slice(-MAX_CHAT_HISTORY);
          return { dAChats: limitedChats };
        }),
      clearDAChats: () => set({ dAChats: [] }),
    }),
    {
      name: "scaleworks-document-automation-chats",
    }
  )
);

export default useDocumentAutomationStore;
