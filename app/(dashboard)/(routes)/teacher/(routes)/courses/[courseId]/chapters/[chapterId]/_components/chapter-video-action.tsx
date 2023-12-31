"use client";

import { FC, useState } from "react";
import { Chapters, MuxData } from "@prisma/client";
import { z } from "zod";
import { PlusCircle, Video } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";

import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import ActionTitle from "@/components/shared/action-titles";
import { FileUpload } from "@/components/shared/file-upload";
import { videoFormSchema } from "@/schema/zodSchema";
import { uploadVideoMux } from "@/actions/actions";
import { useRouter } from "next/navigation";

interface ChapterVideoUploadProps {
  chapter: Chapters & {
    muxData: MuxData | null;
  };
}

const ChapterVideoUpload: FC<ChapterVideoUploadProps> = ({ chapter }) => {
  const [isEdited, setIsEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleEdit = () => {
    setIsEdited((prev) => !prev);
  };

  const videoUrl = chapter?.muxData?.playbackId;

  const onSubmit = async (values: z.infer<typeof videoFormSchema>) => {
    try {
      setIsSubmitting(true);

      if (!chapter?.courseId) {
        throw Error("no course found");
      }

      if (!chapter?.id) {
        throw Error("no chapter found");
      }

      if (!values?.videoUrl) {
        throw Error("not found");
      }

      const isUploaded = await uploadVideoMux(
        chapter?.courseId,
        chapter?.id,
        values?.videoUrl
      );

      setIsEdited((prev) => !prev);
      router?.refresh();

      return toast({
        title: "chapter video succefully uploaded!",
      });
    } catch (error) {
      console.log(error);
      return toast({
        variant: "destructive",
        description: "an error occured during video url upload in server!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ActionTitle Icon={Video} title="Video" />
      <div className="p-6 bg-slate-100 border border-zinc-100 rounded-lg w-full h-fit">
        <div className="flex flex-row items-center justify-between">
          <span className="font-medium text-base">Chapter video</span>
          <button
            onClick={handleEdit}
            disabled={isSubmitting}
            className="font-medium text-sm flex cursor-pointer disabled:opacity-50 "
          >
            {isEdited ? (
              "cancel"
            ) : (
              <>
                <PlusCircle className="w-5 h-5 mr-2" />
                Add a video
              </>
            )}
          </button>
        </div>

        <div className="mt-3  ">
          {isEdited ? (
            <div>
              <FileUpload
                endpoint="chapterVideo"
                onChange={(url) => {
                  if (url) {
                    onSubmit({ videoUrl: url });
                  }
                }}
              />
            </div>
          ) : (
            <div
              className={cn(
                "w-full ",
                !videoUrl &&
                  "bg-gray-200 h-48 flex items-center justify-center rounded-lg "
              )}
            >
              {videoUrl ? (
                <MuxPlayer
                  className="rounded-lg"
                  playbackId={chapter?.muxData?.playbackId || ""}
                />
              ) : (
                <Video className="w-12 h-12 " />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChapterVideoUpload;
