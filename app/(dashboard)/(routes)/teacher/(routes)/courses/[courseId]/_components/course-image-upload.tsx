"use client";

import { FC, useState } from "react";
import { Chapters, Course } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ImagePlus, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { useEdgeStore } from "@/lib/edgestore";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { SingleImageDropzone } from "@/components/ui/single-image";

interface CourseImageUploadProps {
  course: Course & {
    chapters: Chapters[];
  };
}

const CourseImageUpload: FC<CourseImageUploadProps> = ({ course }) => {
  const [isEdited, setIsEdited] = useState(false);
  const [file, setFile] = useState<File | undefined>();
  const [progress, setProgress] = useState<
    "PENDING" | "COMPLETE" | "ERROR" | number
  >("PENDING");

  const { edgestore } = useEdgeStore();
  const router = useRouter();

  const handleImageUpload = async () => {
    if (file) {
      try {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: async (newProgress) => {
            setProgress(newProgress);
            if (newProgress === 100) {
              setProgress("COMPLETE");
            }
          },
        });

        const response = await axios?.patch(`/api/courses/${course?.id}`, {
          imageUrl: res?.url,
        });

        setProgress("PENDING");
        setIsEdited((prev) => !prev);

        return toast({
          title: "image uploaded succefully!",
        });
      } catch (err) {
        setProgress("ERROR");
        console.log(err);
        return toast({
          description: "An error occured try after some time",
          variant: "destructive",
        });
      } finally {
        router?.refresh();
      }
    }
  };

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
          <div className="flex flex-col items-center">
            <SingleImageDropzone
              value={file}
              onChange={setFile}
              disabled={progress !== "PENDING"}
              dropzoneOptions={{
                maxSize: 1024 * 1024 * 1, // 1 MB
              }}
            />
            <Button
              className="mt-2"
              onClick={handleImageUpload}
              disabled={!file || progress !== "PENDING"}
            >
              {progress === "PENDING"
                ? "Upload"
                : progress === "COMPLETE"
                ? "Done"
                : typeof progress === "number"
                ? `Uploading (${Math.round(progress)}%)`
                : "Error"}
            </Button>
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
