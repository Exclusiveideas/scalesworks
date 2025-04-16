import { create } from "zustand";
import { persist } from "zustand/middleware";

const useEDiscoveryStore = create(
  persist(
    (set) => ({
      edChats: [],
      updateEDChats: (newChat) => set((state) => ({ edChats: [...state.edChats, newChat] })),
      clearEDChats: () => set({ edChats: [] }),
    }),
    {
      name: "scaleworks-e-discovery-chats",
    }
  )
);

export default useEDiscoveryStore;