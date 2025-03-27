import { create } from "zustand";

const useDialogStore = create((set) => ({
  isOpen: false,
  isLoading: false,
  updateIsLoading: (loading) => set({ isLoading: loading }),
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
}));


export default useDialogStore;