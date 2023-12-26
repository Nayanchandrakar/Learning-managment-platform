import { create } from "zustand";

interface useMobileInterface {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCourseModal = create<useMobileInterface>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));
