import { create } from "zustand";
import { persist } from "zustand/middleware";

const useChatBotAsstStore = create(
  persist(
    (set) => ({
      chats: [],
      updateChats: (newChat) => set((state) => ({ chats: [...state.chats, newChat] })),
      clearChats: () => set({ chats: [] }),
    }),
    {
      name: "scaleworks-chatBot-assistant-chats",
    }
  )
);

export default useChatBotAsstStore;