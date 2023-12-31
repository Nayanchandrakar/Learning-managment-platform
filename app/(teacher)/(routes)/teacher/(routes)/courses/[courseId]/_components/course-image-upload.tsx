"use client";

import { FC, useState } from "react";
import { Chapters, Course } from "@prisma/client";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { ImageIcon, ImagePlus, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import ActionTitle from "@/components/shared/action-titles";
import { FileUpload } from "@/components/shared/file-upload";
import LazyImage from "@/components/shared/LazyImage";

interface CourseImageUploadProps {
  course: Course & {
    chapters: Chapters[];
  };
}

const formSchema = z.object({
  imageUrl: z.string().min(1),
});

const CourseImageUpload: FC<CourseImageUploadProps> = ({ course }) => {
  const [isEdited, setIsEdited] = useState(false);
  const router = useRouter();

  const handleEdit = () => {
    setIsEdited((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${course?.id}`, values);

      setIsEdited((prev) => !prev);
      router?.refresh();

      return toast({
        title: "course image succefully uploaded!",
      });
    } catch (error) {
      return toast({
        variant: "destructive",
        description: "an error occured during image url upload in server!",
      });
    }
  };

  return (
    <>
      <ActionTitle Icon={ImageIcon} title="Image" />
      <div className="p-6 bg-slate-100 border border-zinc-100 rounded-lg w-full h-fit">
        <div className="flex flex-row items-center justify-between">
          <span className="font-medium text-base">Course image</span>
          <span
            onClick={handleEdit}
            className="font-medium text-sm flex cursor-pointer "
          >
            {isEdited ? (
              "cancel"
            ) : (
              <>
                <PlusCircle className="w-5 h-5 mr-2" />
                Add an image
              </>
            )}
          </span>
        </div>

        <div className="mt-3  ">
          {isEdited ? (
            <div>
              <FileUpload
                endpoint="courseImage"
                onChange={(url) => {
                  if (url) {
                    onSubmit({ imageUrl: url });
                  }
                }}
              />
            </div>
          ) : (
            <div
              className={cn(
                "w-full ",
                !course?.imageUrl &&
                  "bg-zinc-200 text-zinc-800 flex items-center justify-center cursor-pointer",
                !course?.imageUrl && "h-52"
              )}
            >
              {course?.imageUrl ? (
                <LazyImage
                  src={course?.imageUrl!}
                  width={100}
                  height={100}
                  sizes="100vw"
                  alt="course_image"
                  className="w-full h-[15rem] min-h-[250px] rounded-lg object-cover"
                />
              ) : (
                <ImagePlus className="w-12 h-12 " />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseImageUpload;
