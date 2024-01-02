import prismadb from "@/lib/prismadb";
import { getRequest } from "./getRequests";
import { Course } from "@prisma/client";

const errorData = { data: [], totalRevenue: 0, totalSales: 0 };

interface PurchaseWithCourse {
  course: Course;
}

const groupByCourse = (purchase: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchase?.forEach((purchase: PurchaseWithCourse) => {
    const courseTitle = purchase.course.name;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
};

export const getCharts = async () => {
  try {
    const requestData = await getRequest();

    if (!requestData?.isApproved || !requestData?.userId) {
      return errorData;
    }

    const purchase = await prismadb?.purchase.findMany({
      where: {
        course: {
          userId: requestData?.userId,
        },
      },
      include: {
        course: true,
      },
    });

    const groupedEarnings = groupByCourse(purchase);

    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({
        title: courseTitle,
        total: total,
      })
    );

    const totalRevenue = data?.reduce((acc, curr) => acc + curr?.total, 0);

    const totalSales = purchase.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    return errorData;
  }
};
