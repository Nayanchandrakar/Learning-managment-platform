import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { createCourseSchema } from "@/schema/zodSchema";
import { getRequest } from "@/actions/getRequests";

export const POST = async (req: Request) => {
  try {
    const requestData = await getRequest();

    const body = await req?.json();

    const { name } = createCourseSchema.parse(body);

    if (!requestData?.isApproved && !requestData?.userId) {
      return new Response("Unauthorized user access!", { status: 401 });
    }

    const createCourse = await prismadb.course?.create({
      data: {
        name,
        userId: requestData?.userId,
      },
    });

    return NextResponse.json(createCourse);
  } catch (error) {
    console.log("[ERROR_FROM_COURSE_CREATE_ROUTE]", error);
    return new Response("Internal server error!", { status: 500 });
  }
};
