"use client";
import { FC, useState } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapters, Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import ChapterDroppable from "./chapter-droppable";
import { cn } from "@/lib/utils";
import { valuesListInterface } from "@/types/types";

interface CourseChapterProps {
  course: Course & {
    chapters: Chapters[];
  };
}

const formSchema = z?.object({
  title: z.string().min(2).max(30),
});

const CourseChapter: FC<CourseChapterProps> = ({ course }) => {
  const [isEdited, setIsEdited] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const chapters = course?.chapters?.map((chapter) => ({
    title: chapter?.title,
    id: chapter?.id,
    isFree: chapter?.isFree,
    isPublished: chapter?.isPublished,
  }));

  const isSubmiting = !!form?.formState?.isSubmitting;

  const onsubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${course?.id}/reorder`,
        values
      );

      setIsEdited((prev) => !prev);

      router?.refresh();

      return toast({
        title: "course chapter created succefully",
      });
    } catch (error) {
      return toast({
        variant: "destructive",
        description: "An error occured try after some time",
      });
    } finally {
    }
  };

  const handleEdit = () => {
    setIsEdited((prev) => !prev);
  };

  const handleToogle = async (chapterId: string) => {
    router?.push(`/teacher/courses/${course?.id}/chapters/${chapterId}`);
  };

  const reorder = (startIndex: number, endIndex: number) => {
    const [removed] = chapters.splice(startIndex, 1);
    chapters.splice(endIndex, 0, removed);
    return chapters;
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result?.source.index;
    const destinationIndex = result?.destination.index;

    reorder(sourceIndex, destinationIndex);

    const draggedChapter = chapters[destinationIndex];

    const updatedChaptersList = chapters?.map(
      (chapter, index): valuesListInterface => ({
        id: chapter?.id,
        position: index,
      })
    );

    if (draggedChapter) {
      setIsDragging(true);
      try {
        const response = await axios?.put(
          `/api/courses/${course?.id}/reorder`,
          {
            valuesList: updatedChaptersList,
          }
        );

        router?.refresh();
        return toast({
          title: "chapter reordered succfully!",
        });
      } catch (error) {
        return toast({
          variant: "destructive",
          description: "An error occured try after some time",
        });
      } finally {
        setIsDragging(false);
      }
    }
  };

  return (
    <div className="p-6 bg-slate-100 border border-zinc-100 rounded-lg w-full h-fit relative">
      <>
        <div className="flex flex-row items-center justify-between">
          <span className="font-medium text-base">Course chapters</span>
          <span
            onClick={handleEdit}
            className="font-medium text-sm flex cursor-pointer "
          >
            {isEdited ? (
              "cancel"
            ) : (
              <>
                <PlusCircle className="w-5 h-5 mr-2" />
                Add an chapter
              </>
            )}
          </span>
        </div>

        <div className="mt-3 ">
          {isEdited ? (
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form?.handleSubmit(onsubmit)}
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isSubmiting}
                          placeholder="enter chapter title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isSubmiting}>Create</Button>
              </form>
            </Form>
          ) : course?.chapters?.length === 0 ? (
            <p className="font-medium text-sm flex italic text-slate-400">
              {"No chapters"}
            </p>
          ) : (
            <ChapterDroppable
              onDragEnd={onDragEnd}
              chapters={chapters}
              handleToogle={handleToogle}
            />
          )}
        </div>

        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-zinc-100/80 rounded-lg",
            !isDragging && "hidden"
          )}
        >
          <Loader2 className="text-cyan-700 w-8 h-8 animate-spin" />
        </div>
      </>
    </div>
  );
};

export default CourseChapter;
