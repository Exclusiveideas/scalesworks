import { create } from "zustand";
import { persist } from "zustand/middleware";

const useContractReviewStore = create(
  persist(
    (set) => ({
        cRChats: [],
      updateCRChats: (newChat) => set((state) => ({ cRChats: [...state.cRChats, newChat] })),
      clearCRChats: () => set({ cRChats: [] }),
    }),
    {
      name: "scaleworks-contract-review-chats",
    }
  )
);

export default useContractReviewStore;