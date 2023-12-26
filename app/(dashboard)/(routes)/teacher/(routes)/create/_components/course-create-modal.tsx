"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Modal from "@/components/shared/models/modal-handler";
import { useCourseModal } from "@/hooks/use-create-course";
import { createCourseSchema } from "@/schema/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CourseCreateModalProps {}

const CourseCreateModal: FC<CourseCreateModalProps> = ({}) => {
  const createCourseModal = useCourseModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof createCourseSchema>>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      name: "",
    },
  });

  const isSubmiting = form.formState?.isSubmitting;

  const onsubmit = async (values: z.infer<typeof createCourseSchema>) => {
    try {
      const response = await axios.post("/api/courses", values);

      form.reset();
      router.push(`/teacher/courses/${response?.data?.id}`);
      createCourseModal?.onClose();
      return toast({
        title: "course created succefully!",
      });
    } catch (error) {
      console.log(error);
      return toast({
        variant: "destructive",
        description: "An error occured try after some time",
      });
    } finally {
      router.refresh();
    }
  };

  return (
    <Modal
      open={createCourseModal?.isOpen}
      onOpenChange={createCourseModal?.onClose}
    >
      <>
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
          <DialogDescription>
            type the name of the course that you want to create you are one step
            ahead from creating your own course!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onsubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmiting}
                      placeholder="type course name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isSubmiting}>Submit</Button>
            <Button
              type="button"
              onClick={() => createCourseModal?.onClose()}
              variant="secondary"
              className="ml-4"
              disabled={isSubmiting}
            >
              Cancel
            </Button>
          </form>
        </Form>
      </>
    </Modal>
  );
};

export default CourseCreateModal;
