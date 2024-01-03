import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import Container from "@/components/shared/container";
import { CoursesList } from "@/components/shared/course-list";

const page = async ({
  searchParams,
}: {
  searchParams: {
    categoryId: string;
    title: string;
  };
}) => {
  const courses = await getDashboardCourses({ ...searchParams });

  return (
    <Container className="my-12">
      <CoursesList items={courses} />
    </Container>
  );
};

export default page;
