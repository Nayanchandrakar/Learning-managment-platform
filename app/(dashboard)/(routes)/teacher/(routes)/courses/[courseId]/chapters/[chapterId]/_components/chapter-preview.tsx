"use client";
import { FC, useState } from "react";
import { FlipHorizontal, Pencil } from "lucide-react";

import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Checkbox } from "@/components/ui/checkbox";

interface ChapterPreviewProps {
  chapter: Chapters;
}

const formSchema = z.object({
  isFree: z.boolean().default(false).optional(),
});

const ChapterPreview: FC<ChapterPreviewProps> = ({ chapter }) => {
  const [isEdited, setIsEdited] = useState(false);
  const router = useRouter();
  const isFree = chapter?.isFree;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: isFree,
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

      router?.refresh();

      return toast({
        title: "chapter is free for preview!",
      });
    } catch (error) {
      console.log(error);
      return toast({
        variant: "destructive",
        description: "An error occured try after some time",
      });
    }
  };

  const handleEdit = () => {
    setIsEdited((prev) => !prev);
  };

  return (
    <>
      <ActionTitle Icon={FlipHorizontal} title="Category" />
      <div className="p-6 bg-slate-100 border border-zinc-100 rounded-lg w-full h-fit">
        <div className="flex flex-row items-center justify-between">
          <span className="font-medium text-base">Free Preview Chapter</span>
          <span
            onClick={handleEdit}
            className="font-medium text-sm flex cursor-pointer "
          >
            {isEdited ? (
              "cancel"
            ) : (
              <>
                <Pencil className="w-5 h-5 mr-2" />
                Edit access settings
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
                  name="isFree"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-6">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          check this box if you want to make this chapter free
                          for preview
                        </FormLabel>
                      </div>
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
                !isFree && "italic text-slate-400"
              )}
            >
              {!isFree
                ? "This chapter is not free!"
                : "This chapter is free for preview"}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ChapterPreview;
