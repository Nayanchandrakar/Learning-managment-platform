"use client";
import { FC, useState } from "react";
import { GripVertical, Loader2, Pencil, PlusCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapters, Course } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

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
      const response = await axios.patch(`/api/courses/${course?.id}`, {
        chapters: {
          create: {
            title: values?.title,
            position: 0,
          },
        },
      });

      setIsEdited((prev) => !prev);
      return toast({
        title: "course chapter created succefully",
      });
    } catch (error) {
      console.log(error);
      return toast({
        variant: "destructive",
        description: "An error occured try after some time",
      });
    } finally {
      router?.refresh();
    }
  };

  const handleEdit = () => {
    setIsEdited((prev) => !prev);
  };

  const handleClick = async (chapterId: string) => {
    router?.push(`/teacher/courses/${course?.id}/chapters/${chapterId}`);
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
            <div className="space-y-3">
              {chapters?.map((chapter) => (
                <div
                  key={chapter?.id}
                  className={cn(
                    "w-full h-13  flex justify-between items-center flex-row border border-zinc-300 rounded-lg",
                    chapter?.isPublished ? "bg-sky-100" : "bg-gray-200"
                  )}
                >
                  {/* first div here  */}
                  <div className="flex flex-row items-center  ">
                    <span className="w-12 h-12 flex items-center justify-center  border-r border-r-zinc-300 ">
                      <GripVertical
                        className={cn(
                          "w-6 h-6 ",
                          chapter?.isPublished
                            ? "text-sky-800"
                            : "text-gray-600"
                        )}
                      />
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium ml-3 ",
                        chapter?.isPublished ? "text-sky-800" : "text-gray-600"
                      )}
                    >
                      {chapter?.title}
                    </span>
                  </div>

                  {/* second div here  */}
                  <div className="space-x-3 flex items-center flex-row mr-3">
                    {chapter?.isFree && <Badge className="">Free</Badge>}
                    {
                      <Badge
                        className={cn(
                          chapter?.isPublished ? "bg-cyan-700" : "bg-gray-600"
                        )}
                      >
                        {!chapter?.isPublished ? "Draft" : "Published"}
                      </Badge>
                    }
                    <Pencil
                      onClick={() => handleClick(chapter?.id)}
                      className={cn(
                        "w-5 h-5 cursor-pointer",
                        chapter?.isPublished ? "text-cyan-700" : "text-gray-600"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-zinc-200/80 rounded-lg">
          <Loader2 className="text-cyan-700 w-8 h-8 animate-spin" />
        </div>
      </>
    </div>
  );
};

export default CourseChapter;
