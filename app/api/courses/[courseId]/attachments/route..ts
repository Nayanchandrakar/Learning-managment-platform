import { getRequest } from "@/actions/getRequests";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
    };
  }
) => {
  try {
    const { url } = await req?.json();

    if (!url) {
      return new Response("please fill all the fields", { status: 403 });
    }

    const requestData = await getRequest();

    if (!requestData?.isApproved || !requestData?.userId) {
      return new Response("Unauthorized user!", { status: 401 });
    }

    const isCourseOwner = await prismadb?.course?.findUnique({
      where: {
        userId: requestData?.userId,
        id: params?.courseId,
      },
    });

    if (!isCourseOwner) {
      return new Response("create a course first then try !", { status: 402 });
    }

    const updateCourseAttachments = await prismadb?.attachments?.create({
      data: {
        name: url,
        url,
        courseId: isCourseOwner?.id,
      },
    });

    return NextResponse.json(updateCourseAttachments);
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error try after some time", {
      status: 500,
    });
  }
};
