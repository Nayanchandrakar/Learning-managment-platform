import Container from "@/components/shared/container";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import CourseTitle from "./_components/course-title-field";
import CourseDescription from "./_components/course-description-action";
import CourseImageUpload from "./_components/course-image-upload";
import CourseCategory from "./_components/course-category-actoin";
import CourseChapter from "./_components/course-chaptes-actoin";
import CoursePrice from "./_components/course-price-action";
import CourseAttachments from "./_components/course-attachments";
import { Banner } from "@/components/shared/alert-banner";
import CourseHeaderAction from "./_components/course-header-actions";
import { revalidatePath } from "next/cache";

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
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      category: true,
    },
  });

  revalidatePath("fetch_course");

  const categories = await prismadb?.category?.findMany();

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
      {!course?.isPublish && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}

      <Container className="mb-12">
        <CourseHeaderAction
          headerText={courseHeaderText}
          check={isFieldsCompleted}
          course={course}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[55%_45%] gap-x-6">
          {/* course div 1 */}
          <div className="space-y-5">
            <CourseTitle course={course} />
            <CourseDescription course={course} />
            <CourseImageUpload course={course} />
            <CourseCategory course={course} categories={categories} />
          </div>

          <div className="space-y-5">
            <CourseChapter course={course} />
            <CoursePrice course={course} />
            <CourseAttachments course={course} />
          </div>
        </div>
      </Container>
    </>
  );
};

export default CourseIdPage;
