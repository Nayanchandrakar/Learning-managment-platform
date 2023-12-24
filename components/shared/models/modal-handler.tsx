"use client";
import { FC, useEffect, useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: () => void;
}

const Modal: FC<ModalProps> = ({ children, onOpenChange, open }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default Modal;
