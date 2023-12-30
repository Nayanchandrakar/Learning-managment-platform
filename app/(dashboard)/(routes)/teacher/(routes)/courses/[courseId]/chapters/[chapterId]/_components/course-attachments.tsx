"use client";

import { FC, useState } from "react";
import { Attachments, Course } from "@prisma/client";
import Image from "next/image";
import axios from "axios";
import {
  File,
  ImagePlus,
  Loader2,
  Paperclip,
  PlusCircle,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { UploadButton } from "@/utils/uploadthing";
import { FileUpload } from "@/components/shared/file-upload";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ActionTitle from "@/components/shared/action-titles";

interface CourseAttachmentsProps {
  course: Course & {
    attachments: Attachments[];
  };
}

const formSchema = z.object({
  url: z.string().min(4),
});

const CourseAttachments: FC<CourseAttachmentsProps> = ({ course }) => {
  const [isEdited, setIsEdited] = useState(false);
  const [deleteId, setdeleteId] = useState<string | null>(null);
  const router = useRouter();

  const handleEdit = () => {
    setIsEdited((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/courses/${course?.id}/attachments`,
        values
      );
      setIsEdited((prev) => !prev);
      router.refresh();
      return toast({
        title: "course attachement added succefully!",
      });
    } catch (error) {
      console.log(error);
      return toast({
        variant: "destructive",
        description: "please try after some time!",
      });
    }
  };

  const onDelete = async (id: string) => {
    setdeleteId(id);
    try {
      const response = await axios.delete(
        `/api/courses/${course?.id}/attachments/${id}/delete`
      );
      router.refresh();
      return toast({
        title: "course attachement added succefully!",
      });
    } catch (error) {
      console.log(error);
      return toast({
        variant: "destructive",
        description: "please try after some time!",
      });
    } finally {
      setdeleteId(null);
    }
  };

  return (
    <>
      <ActionTitle Icon={Paperclip} title="Attachments" />
      <div className="p-6 bg-slate-100 border border-zinc-100 rounded-lg w-full h-fit">
        <div className="flex flex-row items-center justify-between">
          <span className="font-medium text-base">Course Attachments</span>
          <span
            onClick={handleEdit}
            className="font-medium text-sm flex cursor-pointer "
          >
            {isEdited ? (
              "cancel"
            ) : (
              <>
                <PlusCircle className="w-5 h-5 mr-2" />
                Add an attachment
              </>
            )}
          </span>
        </div>

        <div className="mt-3  ">
          {isEdited ? (
            <div>
              <FileUpload
                endpoint="courseAttachment"
                onChange={(url) => {
                  if (url) {
                    onSubmit({ url });
                  }
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full">
              {course?.attachments?.length === 0 ? (
                <p className="font-medium text-sm flex italic text-slate-400">
                  No attachments found.
                </p>
              ) : (
                <div className="space-y-3">
                  {course?.attachments?.map((file) => (
                    <div
                      key={file?.id}
                      className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                    >
                      <File className="h-4 w-4 mr-2 flex-shrink-0" />
                      <p className="text-xs line-clamp-1">{file?.name}</p>
                      {deleteId === file?.id && (
                        <div>
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      )}
                      {deleteId !== file?.id && (
                        <button
                          onClick={() => onDelete(file?.id)}
                          className="ml-auto hover:opacity-75 transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseAttachments;
