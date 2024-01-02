import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";

interface CourseRoutesProps {
  chapterId: string;
  isCompleted: boolean;
  courseId: string;
  label: string;
  isLocked: boolean;
}

const CourseRoutes = ({
  chapterId,
  courseId,
  isCompleted,
  isLocked,
  label,
}: CourseRoutesProps) => {
  return (
    <Link
      href={`/course/${courseId}/chapter/${chapterId}`}
      className={cn("p-4 w-full h-fit border-r-[10px] border-r-red-300")}
    >
      {label}
    </Link>
  );
};

export default CourseRoutes;
