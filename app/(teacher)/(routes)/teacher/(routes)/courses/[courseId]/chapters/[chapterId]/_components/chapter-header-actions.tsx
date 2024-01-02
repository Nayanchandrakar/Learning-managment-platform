"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Chapters, MuxData } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

interface ChapterHeaderActionsProps {
  headerText: string;
  check: boolean;
  chapter: Chapters & {
    muxData: MuxData;
  };
}

const ChapterHeaderActions: FC<ChapterHeaderActionsProps> = ({
  headerText,
  check,
  chapter,
}) => {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const router = useRouter();

  const isPublished = chapter?.isPublished;
  const courseId = chapter?.courseId;
  const chapterId = chapter?.id;

  const redirectToCoursePage = () =>
    router?.push(`/teacher/courses/${courseId}`);

  const onsubmit = async () => {
    try {
      setIsSubmiting(true);
      const response = await axios?.get(
        `/api/courses/${courseId}/chapter/${chapterId}/publish`
      );

      const isPublished = !!response?.data?.isPublished || false;

      const publishMessage = isPublished
        ? "chapter is succefully published"
        : "chapter is UnPublished";

      const toastVariant = !isPublished ? "destructive" : "default";

      redirectToCoursePage();

      return toast({
        title: publishMessage,
        variant: toastVariant,
      });
    } catch (error) {
      return toast({
        variant: "destructive",
        description: "try after some time",
      });
    } finally {
      setIsSubmiting(false);
    }
  };

  const deleteChapter = async () => {
    try {
      setIsSubmiting(true);
      const response = await axios.delete(
        `/api/courses/${courseId}/chapter/${chapterId}/delete`
      );

      redirectToCoursePage();

      return toast({
        title: "chapter deleted succefully",
      });
    } catch (error) {
      return toast({
        variant: "destructive",
        description: "try after some time",
      });
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <div className="flex justify-between items-center flex-row  py-5">
      <div className="flex flex-col items-start justify-center space-y-2">
        <h2 className="text-lg md:text-xl font-semibold ">Chapter creation</h2>
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
          onClick={deleteChapter}
        >
          <Trash className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChapterHeaderActions;
