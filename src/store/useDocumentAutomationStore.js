import { create } from "zustand";
import { persist } from "zustand/middleware";

const useDocumentAutomationStore = create(
  persist(
    (set) => ({
        dAChats: [],
      updateDAChats: (newChat) => set((state) => ({ dAChats: [...state.dAChats, newChat] })),
      clearDAChats: () => set({ dAChats: [] }),
    }),
    {
      name: "document-automation-chats",
    }
  )
);

export default useDocumentAutomationStore;