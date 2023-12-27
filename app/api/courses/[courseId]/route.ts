import { getRequest } from "@/actions/getRequests";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string | null | undefined;
    };
  }
) => {
  try {
    const requestData = await getRequest();

    if (!requestData?.isApproved && !requestData?.userId) {
      return new Response("Unauthorized user access!", { status: 401 });
    }

    const values = await req?.json();

    const course = await prismadb?.course?.update({
      where: {
        id: params?.courseId!,
        userId: requestData?.userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[ERROR_FROM_COURSE_UPDATE_ROUTE]", error);
    return new Response("Internal server error!", { status: 500 });
  }
};
