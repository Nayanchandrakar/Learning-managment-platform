"use client";
import { useTeaherModal } from "@/hooks/use-teacher-modal";
import { FC } from "react";
import Modal from "@/components/shared/models/modal-handler";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TeacherModalProps {}

const TeacherModal: FC<TeacherModalProps> = ({}) => {
  const teacherModal = useTeaherModal();

  return (
    <Modal open={true} onOpenChange={teacherModal?.onClose}>
      <DialogTitle>Teacher Request</DialogTitle>
      <DialogDescription>DialogDescription</DialogDescription>
    </Modal>
  );
};

export default TeacherModal;
