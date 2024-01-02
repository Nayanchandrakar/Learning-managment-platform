import { getProgress } from "@/actions/getProgress";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import CourseSidebar from "./_components/CourseSidebar";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    courseId: string;
  };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const courseData = await prismadb?.course?.findFirst({
    where: {
      id: params?.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!courseData) {
    return redirect("/");
  }

  const progressCount = await getProgress(userId, courseData?.id!);

  return (
    <div className="w-full h-full flex ">
      {/* sidebar div  */}

      <div
        className="fixed hidden md:flex inset-0 w-72 h-full  border-r p-4 bg-white z-[50]
  "
      >
        <CourseSidebar progress={progressCount} course={courseData} />
      </div>

      {/* Pages div  */}
      <main className=" md:ml-72 w-full  h-full mt-20">{children}</main>
    </div>
  );
};

export default CourseLayout;
