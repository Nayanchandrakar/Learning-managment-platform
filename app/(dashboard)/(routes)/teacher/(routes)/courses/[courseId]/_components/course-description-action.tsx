"use client";
import { FC, useState } from "react";
import { Pencil } from "lucide-react";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapters, Course } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CourseDescriptionProps {
  course: Course & {
    chapters: Chapters[];
  };
}

const formSchema = z.object({
  description: z.string().min(4).max(80),
});

const CourseDescription: FC<CourseDescriptionProps> = ({ course }) => {
  const [isEdited, setIsEdited] = useState(false);
  const router = useRouter();
  const description = course?.description;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: description || "",
    },
  });

  const isSubmiting = !!form?.formState?.isSubmitting;

  const onsubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${course?.id}`, values);

      setIsEdited((prev) => !prev);
      return toast({
        title: "course description updated succefully",
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
    <div className="p-6 bg-slate-100 border border-zinc-100 rounded-lg w-full h-fit">
      <div className="flex flex-row items-center justify-between">
        <span className="font-medium text-base">description</span>
        <span
          onClick={handleEdit}
          className="font-medium text-sm flex cursor-pointer "
        >
          {isEdited ? (
            "cancel"
          ) : (
            <>
              <Pencil className="w-5 h-5 mr-2" />
              Edit description
            </>
          )}
        </span>
      </div>

      <div className="mt-3  ">
        {isEdited ? (
          <Form {...form}>
            <form className="space-y-4" onSubmit={form?.handleSubmit(onsubmit)}>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmiting}
                        placeholder="enter course description"
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
              !description && "italic text-slate-400"
            )}
          >
            {description || "no description added!"}
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseDescription;
