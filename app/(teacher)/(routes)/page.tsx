import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import Container from "@/components/shared/container";
import { CoursesList } from "@/components/shared/course-list";

const page = async () => {
  const courses = await getDashboardCourses();

  return (
    <Container className="my-12">
      <CoursesList items={courses} />
    </Container>
  );
};

export default page;
