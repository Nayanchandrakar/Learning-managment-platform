"use client";
import { FC, useState } from "react";
import { BookOpenText, Pencil } from "lucide-react";

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
import axios from "axios";
import { useRouter } from "next/navigation";
import ActionTitle from "@/components/shared/action-titles";
import TextEditor from "@/components/shared/text-editor";

interface ChapterDescriptionProps {
  chapter: Chapters;
}

const formSchema = z.object({
  description: z.string().min(4),
});

const ChapterDescription: FC<ChapterDescriptionProps> = ({ chapter }) => {
  const [isEdited, setIsEdited] = useState(false);
  const router = useRouter();
  const description = chapter?.description;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: description || "",
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
        title: "chapter description updated succefully",
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
      <ActionTitle Icon={BookOpenText} title="Description" />
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
              <form
                className="space-y-4"
                onSubmit={form?.handleSubmit(onsubmit)}
              >
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TextEditor {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isSubmiting}>Submit</Button>
              </form>
            </Form>
          ) : !description ? (
            <p className="font-medium text-sm flex italic text-slate-400">
              {description || "no description added!"}
            </p>
          ) : (
            <TextEditor theme="bubble" readOnly value={description} />
          )}
        </div>
      </div>
    </>
  );
};

export default ChapterDescription;
