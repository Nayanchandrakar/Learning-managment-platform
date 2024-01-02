import prismadb from "@/lib/prismadb";
import { getRequest } from "./getRequests";
import { Course, Purchase } from "@prisma/client";

const errorData = { data: [], totalRevenue: 0, totalSales: 0 };

interface PurchaseWithCourse {
  purchase: Purchase & {
    course: Course;
  };
}

const groupByCourse = (purchase: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchase?.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += purchase.course.price!;
  });
};

export const getCharts = async () => {
  try {
    const requestData = await getRequest();

    if (!requestData?.isApproved || !requestData?.userId) {
      return [];
    }
  } catch (error) {
    return [errorData];
  }
};
