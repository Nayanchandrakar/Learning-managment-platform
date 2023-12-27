"use client";
import { FC, useState } from "react";
import { Pencil } from "lucide-react";

import { Combobox } from "@/components/ui/combobox";
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
import { Category, Chapters, Course } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CourseCategoryProps {
  course: Course & {
    chapters: Chapters[];
  };
  categories: Category[];
}

const formSchema = z.object({
  categoryId: z.string().min(1),
});

const CourseCategory: FC<CourseCategoryProps> = ({ course, categories }) => {
  const [isEdited, setIsEdited] = useState(false);
  const router = useRouter();
  const selectedCategory = course?.categoryId;
  const selectedCategoryName = categories?.find(
    (category) => category?.id === course?.categoryId
  )?.name;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: selectedCategory || "",
    },
  });

  const isSubmiting = !!form?.formState?.isSubmitting;

  const options = categories?.map((category) => ({
    label: category?.name,
    value: category?.id,
  }));

  const onsubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${course?.id}`, values);

      setIsEdited((prev) => !prev);
      return toast({
        title: "course category added succefully",
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
        <span className="font-medium text-base">Course category</span>
        <span
          onClick={handleEdit}
          className="font-medium text-sm flex cursor-pointer "
        >
          {isEdited ? (
            "cancel"
          ) : (
            <>
              <Pencil className="w-5 h-5 mr-2" />
              Edit category
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
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Combobox options={options} {...field} />
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
              !selectedCategoryName && "italic text-slate-400"
            )}
          >
            {selectedCategoryName || "no category selected!"}
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseCategory;
