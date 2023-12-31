"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Chapters, Course } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AlertModal from "@/components/shared/models/confirm-modal";

interface CourseHeaderActionProps {
  headerText: string;
  check: boolean;
  course: Course & {
    chapters: Chapters[];
  };
}

const CourseHeaderAction: FC<CourseHeaderActionProps> = ({
  headerText,
  check,
  course,
}) => {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const handleToogle = () => setIsOpen((prev) => !prev);

  const isPublished = course?.isPublish;
  const courseId = course?.id;

  const redirectHomePage = () => router?.push(`/`);

  const onsubmit = async () => {
    try {
      setIsSubmiting(true);
      const response = await axios?.get(`/api/courses/${courseId}/publish`);

      const isPublish = !!response?.data?.isPublish || false;

      const publishMessage = isPublish
        ? "course is live now"
        : "course is not visible to others";

      const toastVariant = !isPublish ? "destructive" : "default";

      redirectHomePage();

      return toast({
        title: publishMessage,
        variant: toastVariant,
      });
    } catch (error: any) {
      if (error?.response?.status === 406) {
        return toast({
          variant: "destructive",
          description: "please fill the fields",
        });
      } else {
        return toast({
          variant: "destructive",
          description: "try after some time",
        });
      }
    } finally {
      setIsSubmiting(false);
    }
  };

  const deleteCourse = async () => {
    try {
      setIsSubmiting(true);
      const response = await axios.delete(`/api/courses/${courseId}/delete`);

      redirectHomePage();

      return toast({
        title: "course deleted succefully",
      });
    } catch (error: any) {
      if (error?.response?.status === 405) {
        return toast({
          variant: "destructive",
          description: error?.response?.data,
        });
      } else {
        return toast({
          variant: "destructive",
          description: error?.response?.data,
        });
      }
    } finally {
      setIsSubmiting(false);
      handleToogle();
    }
  };

  return (
    <div className="flex justify-between items-center flex-row  py-5">
      <div className="flex flex-col items-start justify-center space-y-2">
        <h2 className="text-lg md:text-xl font-semibold ">Course creation</h2>
        <p className="text-zinc-500 text-sm md:text-base">{headerText}</p>
      </div>
      <div className="flex flex-row items-center space-x-3">
        <Button
          disabled={!check || isSubmiting}
          onClick={onsubmit}
          className="disabled:opacity-60"
          variant="outline"
        >
          {isPublished ? "Unpublish" : "Publish"}
        </Button>

        <Button
          disabled={isSubmiting}
          className="disabled:opacity-60"
          onClick={handleToogle}
        >
          <Trash className="w-5 h-5" />
        </Button>

        <AlertModal onOpenChange={handleToogle} isOpen={isOpen}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              disabled={isSubmiting}
              className="disabled:opacity-60"
              onClick={handleToogle}
            >
              Cancel
            </Button>

            <Button
              disabled={isSubmiting}
              className="disabled:opacity-60 bg-red-600 hover:bg-red-600/90"
              onClick={() => deleteCourse()}
            >
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertModal>
      </div>
    </div>
  );
};

export default CourseHeaderAction;
