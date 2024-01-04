import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { Chapters, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import CourseRoutes from "./course-routes";
import CourseProgress from "@/components/shared/course-progress";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapters & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progress: number;
}

const CourseSidebar = async ({ course, progress }: CourseSidebarProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await prismadb?.purchase?.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course?.id,
      },
    },
  });

  return (
    <aside className="md:mt-20 flex flex-col space-y-3 w-full">
      {/* progress bar here  */}

      {purchase && (
        <div className="mt-10 px-3">
          <CourseProgress variant="success" value={progress} />
        </div>
      )}

      <div className="flex flex-col space-y-3 w-full h-full">
        {course?.chapters?.map((chapter) => (
          <CourseRoutes
            key={chapter?.id}
            chapterId={chapter?.id!}
            label={chapter?.title!}
            isCompleted={!!chapter?.userProgress?.[0]?.isCompleted}
            courseId={chapter?.courseId}
            isLocked={!!(!chapter?.isFree && !purchase)}
          />
        ))}
      </div>
    </aside>
  );
};

export default CourseSidebar;
