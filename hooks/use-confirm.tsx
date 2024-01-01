import { create } from "zustand";

interface authInterface {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useConfirmModal = create<authInterface>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));
