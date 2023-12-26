import BackButton from "@/components/shared/back-button";
import Container from "@/components/shared/container";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
  params,
}: {
  params: {
    courseId: string | null | undefined;
  };
}) => {
  const { courseId } = params;

  const course = await prismadb?.course?.findFirst({
    where: {
      id: courseId!,
    },
  });

  if (!course) {
    return redirect("/");
  }

  return <>
  <Container>
    <BackButton />
  </Container>
  </>
};

export default CourseIdPage;
