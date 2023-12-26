"use client";
import { FC } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import Modal from "@/components/shared/models/modal-handler";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTeaherModal } from "@/hooks/use-teacher-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { requests } from "@prisma/client";
import { MoveUpRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { formSchema } from "@/schema/zodSchema";
import { useRouter } from "next/navigation";

interface TeacherModalProps {
  request: requests | null;
}

const TeacherModal: FC<TeacherModalProps> = ({ request }) => {
  const teacherModal = useTeaherModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      description: "",
    },
  });

  const isSubmiting = form.formState?.isSubmitting;

  const onsubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/request", values);
      form.reset();
      return toast({
        title: "Your application has been sent!",
      });
    } catch (error) {
      console.log(error);
      return toast({
        variant: "default",
        description: "An error occured try after some time",
      });
    } finally {
      router.refresh();
    }
  };

  const handleClick = () => {
    teacherModal?.onClose();
    return router.push("/teacher");
  };

  return (
    <Modal open={teacherModal?.isOpen} onOpenChange={teacherModal?.onClose}>
      {request?.userId && request?.email ? (
        <div className="flex items-center justify-center w-full h-full flex-col">
          {request?.isApproved ? (
            <>
              <p className="mb-4 text-sm">
                Congratulations you'r request for being a teacher has been
                approved by our administrator.
              </p>
              <Button size="sm" onClick={handleClick}>
                Teacher's Page
                <MoveUpRight className="w-5 h-5 ml-2" />
              </Button>
            </>
          ) : (
            <p className="mb-4 text-sm text-center pt-5 pb-4">
              Your application is under Review we will shortly connect you about
              your applicaton status!😊
            </p>
          )}
        </div>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>Request to be a teacher</DialogTitle>
            <DialogDescription>
              Interested in becoming a teacher? Request application access by
              providing required details. Join us in shaping the future of
              education.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmiting}
                        placeholder="enter your name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmiting}
                        placeholder="enter your contact email id"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isSubmiting}
                        placeholder="why you want to become a teacher explain in minimum 50 words"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={isSubmiting}
                className="w-full bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500"
              >
                Request
              </Button>
            </form>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default TeacherModal;
