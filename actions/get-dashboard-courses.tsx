import prismadb from "@/lib/prismadb";

export const getDashboardCourses = async () => {
  try {
    const allCourses = await prismadb?.course?.findMany({
      where: {
        isPublish: true,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
        },
      },
    });

    const formattedCourses = allCourses?.map((course) => ({
      ...course,
      progress: null,
    }));

    return formattedCourses;
  } catch (error) {
    return [];
  }
};
