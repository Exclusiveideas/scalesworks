import { create } from "zustand";

const useAdminDashboardStore = create((set) => ({

  // Whitelist-Blacklist store
  isEmailListOpen: false,
  wlIsLoading: false,
  blIsLoading: false,
  updateWLIsLoading: (loading) => set({ wlIsLoading: loading }),
  updateBLIsLoading: (loading) => set({ blIsLoading: loading }),
  openEmailListDialog: () => set({ isEmailListOpen: true }),
  closeEmailListDialog: () => set({ isEmailListOpen: false }),

  // Company logo store
  isUpdateCompanyLogoOpen: false,
  isCLLoading: false,
  updateIsCLLoading: (loading) => set({ isCLLoading: loading }),
  openUpdateCompanyLogoDialog: () => set({ isUpdateCompanyLogoOpen: true }),
  closeUpdateCompanyLogoDialog: () => set({ isUpdateCompanyLogoOpen: false }),
}));

export default useAdminDashboardStore;