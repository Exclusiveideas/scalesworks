import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_CHAT_HISTORY = 50;

const useEDiscoveryStore = create(
  persist(
    (set) => ({
      edChats: [],
      updateEDChats: (newChat) =>
        set((state) => {
          const updatedChats = [...state.edChats, newChat];
          // Keep only the last 50 messages
          const limitedChats = updatedChats.slice(-MAX_CHAT_HISTORY);
          return { edChats: limitedChats };
        }),
      clearEDChats: () => set({ edChats: [] }),
    }),
    {
      name: "scaleworks-e-discovery-chats",
    }
  )
);

export default useEDiscoveryStore;