"use client";
import { FC, useState } from "react";
import { FolderEdit, Pencil } from "lucide-react";

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
import { Chapters } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import ActionTitle from "@/components/shared/action-titles";

interface ChapterTitleProps {
  chapter: Chapters;
}

const formSchema = z.object({
  title: z.string().min(3).max(30),
});

const ChapterTitle: FC<ChapterTitleProps> = ({ chapter }) => {
  const [isEdited, setIsEdited] = useState(false);
  const router = useRouter();
  const title = chapter?.title;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title || "",
    },
  });

  const isSubmiting = !!form?.formState?.isSubmitting;

  const onsubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(
        `/api/courses/${chapter?.courseId}/chapter/${chapter?.id}`,
        values
      );

      setIsEdited((prev) => !prev);
      return toast({
        title: "chapter title updated succefully",
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
          <span className="font-medium text-base">Chapter title</span>
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
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isSubmiting}
                          placeholder="type chapter title"
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
                !title && "italic text-slate-400"
              )}
            >
              {title || "There is no chapter title"}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ChapterTitle;
