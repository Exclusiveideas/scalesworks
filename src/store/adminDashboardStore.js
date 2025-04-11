import { create } from "zustand";

const useAdminDashboardStore = create((set) => ({
  isEmailListOpen: false,
  isLoading: false,
  updateIsLoading: (loading) => set({ isLoading: loading }),
  openEmailListDialog: () => set({ isEmailListOpen: true }),
  closeEmailListDialog: () => set({ isEmailListOpen: false }),
}));


export default useAdminDashboardStore;