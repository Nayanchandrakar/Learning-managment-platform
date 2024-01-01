"use client";

import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { FC, useEffect, useState } from "react";

interface AlertModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: () => void;
}

const AlertModal: FC<AlertModalProps> = ({
  children,
  isOpen,
  onOpenChange,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>{children}</AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertModal;
