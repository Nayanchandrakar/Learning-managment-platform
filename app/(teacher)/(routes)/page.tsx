import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import Container from "@/components/shared/container";
import { CoursesList } from "@/components/shared/course-list";
import CategoryFilter from "./_components/category-filter";
import SearchBar from "@/components/Navbar/searchbar";

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
    <Container className=" my-1">
      <div className="md:hidden inline-block w-full h-fit">
        <SearchBar />
      </div>

      <div className="py-6 md:pb-10 w-full ">
        <CategoryFilter />
      </div>
      <CoursesList items={courses} />
    </Container>
  );
};

export default page;
