import BackButton from "@/components/shared/back-button";
import Container from "@/components/shared/container";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import CourseHeaderActions from "./_components/course-header-actions";

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
    include: {
      attachments: true,
      chapters: true,
      category: true,
    },
  });

  console.log(course);

  if (!course) {
    return redirect("/");
  }

  const fields = [
    !!course?.chapters?.some((chapter) => chapter?.isPublished),
    course?.categoryId,
    course?.description,
    course?.price,
    course?.imageUrl,
    course?.name,
  ];

  const totalFields = fields?.length;
  const completedFields = fields?.filter(Boolean).length;

  const courseHeaderText = `Complete all fields (${completedFields}/${totalFields})`;

  const isFieldsCompleted = !!fields?.every(Boolean);

  return (
    <>
      <Container>
        <CourseHeaderActions
          headerText={courseHeaderText}
          check={isFieldsCompleted}
        />
      </Container>
    </>
  );
};

export default CourseIdPage;
