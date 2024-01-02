"use client";
import { FC, useState } from "react";
import { CircleDollarSign, Pencil } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Chapters, Course } from "@prisma/client";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getPrice } from "@/lib/price-format";
import ActionTitle from "@/components/shared/action-titles";

interface CoursePriceProps {
  course: Course & {
    chapters: Chapters[];
  };
}

const formSchema = z.object({
  price: z.coerce.number(),
});

const CoursePrice: FC<CoursePriceProps> = ({ course }) => {
  const [isEdited, setIsEdited] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: course?.price || 0,
    },
  });

  const formattedPrice = getPrice.format(course?.price || 0);

  const isSubmiting = !!form?.formState?.isSubmitting;

  const onsubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${course?.id}`, values);

      setIsEdited((prev) => !prev);
      return toast({
        title: "course price updated succefully",
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
      <ActionTitle Icon={CircleDollarSign} title="Price" />
      <div className="p-6 bg-slate-100 border border-zinc-100 rounded-lg w-full h-fit">
        <div className="flex flex-row items-center justify-between">
          <span className="font-medium text-base">Course price</span>
          <span
            onClick={handleEdit}
            className="font-medium text-sm flex cursor-pointer "
          >
            {isEdited ? (
              "cancel"
            ) : (
              <>
                <Pencil className="w-5 h-5 mr-2" />
                Edit price
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
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isSubmiting}
                          placeholder="enter your course price"
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
                !course?.price && "italic text-slate-400"
              )}
            >
              {course?.price ? formattedPrice : "price not set yet."}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default CoursePrice;
