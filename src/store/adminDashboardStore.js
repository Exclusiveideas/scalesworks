import { create } from "zustand";

const useAdminDashboardStore = create((set) => ({
  isEmailListOpen: false,
  wlIsLoading: false,
  blIsLoading: false,
  updateWLIsLoading: (loading) => set({ wlIsLoading: loading }),
  updateBLIsLoading: (loading) => set({ blIsLoading: loading }),
  openEmailListDialog: () => set({ isEmailListOpen: true }),
  closeEmailListDialog: () => set({ isEmailListOpen: false }),
}));


export default useAdminDashboardStore;