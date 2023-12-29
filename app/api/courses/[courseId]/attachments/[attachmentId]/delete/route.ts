import { getRequest } from "@/actions/getRequests";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
      attachmentId: string;
    };
  }
) => {
  try {
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

    const deleteAttachment = await prismadb?.attachments?.delete({
      where: {
        id: params?.attachmentId,
        courseId: params?.courseId,
      },
    });

    return NextResponse.json(deleteAttachment);
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error try after some time", {
      status: 500,
    });
  }
};
