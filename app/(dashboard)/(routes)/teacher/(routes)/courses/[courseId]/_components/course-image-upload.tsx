"use client";

import { FC, useState } from "react";
import { Chapters, Course } from "@prisma/client";
import Image from "next/image";
import axios from "axios";
import { ImagePlus, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { UploadButton } from "@/utils/uploadthing";

interface CourseImageUploadProps {
  course: Course & {
    chapters: Chapters[];
  };
}

const CourseImageUpload: FC<CourseImageUploadProps> = ({ course }) => {
  const [isEdited, setIsEdited] = useState(false);

  const handleEdit = () => {
    setIsEdited((prev) => !prev);
  };

  return (
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
          <div className="flex flex-col items-center w-full h-[15rem] justify-center border border-dashed border-zinc-600 rounded-lg">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={async (res) => {
                try {
                  const response = await axios.patch(
                    `/api/courses/${course?.id}`,
                    {
                      imageUrl: res?.[0]?.url,
                    }
                  );

                  setIsEdited((prev) => !prev);
                  return toast({
                    title: "course image succefully uploaded!",
                  });
                } catch (error) {
                  console.log(
                    error,
                    "an error occured during chapter image uploading"
                  );
                  return toast({
                    variant: "destructive",
                    description:
                      "an error occured during image url upload in server!",
                  });
                }
              }}
              onUploadError={(error: Error) => {
                console.log(error, "error from course image upload");
                return toast({
                  variant: "destructive",
                  description: "an error occured during image upload!",
                });
              }}
            />
          </div>
        ) : (
          <div
            className={cn(
              "w-full ",
              !course?.imageUrl &&
                "bg-zinc-200 text-zinc-800 flex items-center justify-center cursor-pointer"
            )}
          >
            {course?.imageUrl ? (
              <Image
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
  );
};

export default CourseImageUpload;
