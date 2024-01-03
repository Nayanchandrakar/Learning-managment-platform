import { Category, Chapters, Course } from "@prisma/client";

import prismadb from "@/lib/prismadb";
import { getProgress } from "./getProgress";

type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapters[];
  progress: number | null;
};

type BrowseCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
};

export const getBrowseCourses = async (
  userId: string
): Promise<BrowseCourses> => {
  try {
    const purchasedCourses = await prismadb.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map(
      (purchase) => purchase.course
    ) as CourseWithProgressWithCategory[];

    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course["progress"] = progress;
    }

    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );
    const coursesInProgress = courses.filter(
      (course) => (course.progress ?? 0) < 100
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log("[GET_BROWSE_COURSES_ERROR]", error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
