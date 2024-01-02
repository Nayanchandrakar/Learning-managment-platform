"use client";
import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useCourseModal } from "@/hooks/use-create-course";

const CourseCreatePage = () => {
  const courseCreateModal = useCourseModal();
  return (
    <Container className="flex  items-center justify-center w-full h-[80vh]">
      <Button onClick={() => courseCreateModal.onOpen()}>
        <PlusCircle className="w-5 h-5 mr-2" />
        create
      </Button>
    </Container>
  );
};

export default CourseCreatePage;
