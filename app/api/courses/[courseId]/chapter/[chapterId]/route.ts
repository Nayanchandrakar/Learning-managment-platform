import { getRequest } from "@/actions/getRequests";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
      chapterId: string;
    };
  }
) => {
  try {
    const values = await req?.json();
    const { courseId, chapterId } = params;

    if (!values) {
      return new Response("please pass  a value to update!", { status: 405 });
    }

    const requestData = await getRequest();

    if (!requestData?.isApproved && !requestData?.userId) {
      return new Response("Unauthorized user access!", { status: 401 });
    }

    const updateCourseChapter = await prismadb?.chapters.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(updateCourseChapter);
  } catch (error) {
    console.log(error);
    return new Response("Internal server error", { status: 500 });
  }
};
