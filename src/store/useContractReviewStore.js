import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_CHAT_HISTORY = 50;

const useContractReviewStore = create(
  persist(
    (set) => ({
      cRChats: [],
      updateCRChats: (newChat) =>
        set((state) => {
          const updatedChats = [...state.cRChats, newChat];
          // Keep only the last 50 messages
          const limitedChats = updatedChats.slice(-MAX_CHAT_HISTORY);
          return { cRChats: limitedChats };
        }),
      clearCRChats: () => set({ cRChats: [] }),
    }),
    {
      name: "scaleworks-contract-review-chats",
    }
  )
);

export default useContractReviewStore;
