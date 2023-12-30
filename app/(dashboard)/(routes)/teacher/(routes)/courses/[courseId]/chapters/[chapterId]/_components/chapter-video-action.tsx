"use client";

import { FC, useState } from "react";
import { Chapters, Course, MuxData } from "@prisma/client";
import { z } from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ImageIcon, PlusCircle, Video } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";

import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import ActionTitle from "@/components/shared/action-titles";
import { FileUpload } from "@/components/shared/file-upload";

interface ChapterVideoUploadProps {
  chapter: Chapters & {
    muxData: MuxData | null;
  };
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideoUpload: FC<ChapterVideoUploadProps> = ({ chapter }) => {
  const [isEdited, setIsEdited] = useState(false);
  const router = useRouter();

  const handleEdit = () => {
    setIsEdited((prev) => !prev);
  };

  const videoUrl = chapter?.muxData?.playbackId;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/courses/${chapter?.courseId}/chapter/${chapter?.id}`,
        values
      );

      setIsEdited((prev) => !prev);
      router?.refresh();

      return toast({
        title: "chapter video succefully uploaded!",
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
      <ActionTitle Icon={Video} title="Video" />
      <div className="p-6 bg-slate-100 border border-zinc-100 rounded-lg w-full h-fit">
        <div className="flex flex-row items-center justify-between">
          <span className="font-medium text-base">Chapter video</span>
          <span
            onClick={handleEdit}
            className="font-medium text-sm flex cursor-pointer "
          >
            {isEdited ? (
              "cancel"
            ) : (
              <>
                <PlusCircle className="w-5 h-5 mr-2" />
                Add a video
              </>
            )}
          </span>
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
                <MuxPlayer playbackId={chapter?.muxData?.playbackId || ""} />
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
