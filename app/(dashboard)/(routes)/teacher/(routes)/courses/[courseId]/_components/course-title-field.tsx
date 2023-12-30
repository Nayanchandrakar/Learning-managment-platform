"use client";
import { FC, useState } from "react";
import { FolderEdit, Pencil } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createCourseSchema } from "@/schema/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapters, Course } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import ActionTitle from "@/components/shared/action-titles";

interface CourseTitleProps {
  course: Course & {
    chapters: Chapters[];
  };
}

const CourseTitle: FC<CourseTitleProps> = ({ course }) => {
  const [isEdited, setIsEdited] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof createCourseSchema>>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      name: course?.name || "",
    },
  });

  const isSubmiting = !!form?.formState?.isSubmitting;

  const onsubmit = async (values: z.infer<typeof createCourseSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${course?.id}`, values);

      setIsEdited((prev) => !prev);
      return toast({
        title: "course name updated succefully",
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

  return (
    <>
      <ActionTitle Icon={FolderEdit} title="Title" />
      <div className="p-6 bg-slate-100 border border-zinc-100 rounded-lg w-full h-fit">
        <div className="flex flex-row items-center justify-between">
          <span className="font-medium text-base">Course title</span>
          <span
            onClick={handleEdit}
            className="font-medium text-sm flex cursor-pointer "
          >
            {isEdited ? (
              "cancel"
            ) : (
              <>
                <Pencil className="w-5 h-5 mr-2" />
                Edit title
              </>
            )}
          </span>
        </div>

        <div className="mt-3 transition-all duration-300">
          {isEdited ? (
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form?.handleSubmit(onsubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isSubmiting}
                          placeholder="type course name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isSubmiting}>Submit</Button>
              </form>
            </Form>
          ) : (
            <p
              className={cn(
                "font-medium text-sm flex",
                !course?.name && "italic text-slate-400"
              )}
            >
              {course?.name}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseTitle;
