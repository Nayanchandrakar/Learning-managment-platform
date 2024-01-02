import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
  params,
}: {
  params: {
    courseId: string;
  };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await prismadb?.course?.findFirst({
    where: {
      id: params?.courseId,
    },
    include: {
      chapters: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const authenticUserRedirectUrl = `/course/${course?.id}/chapter/${course?.chapters?.[0]?.id}`;

  return redirect(authenticUserRedirectUrl);
};

export default CourseIdPage;
