import prismadb from "@/lib/prismadb";

interface searchParams {
  categoryId: string;
  title: string;
}

export const getDashboardCourses = async ({
  categoryId,
  title,
}: searchParams) => {
  try {
    const allCourses = await prismadb?.course?.findMany({
      where: {
        isPublish: true,
        name: {
          contains: title,
        },
        categoryId: categoryId,
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
