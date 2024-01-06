import { getRequest } from "@/actions/getRequests";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const GET = async (
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
    const { courseId } = params;

    if (!courseId) {
      return new Response("please provide parametes", { status: 404 });
    }

    const requestData = await getRequest();
    if (!requestData?.isApproved || !requestData?.userId) {
      return new Response("Unauthorized user!", { status: 401 });
    }

    const courseOwner = await prismadb?.course?.findFirst({
      where: {
        id: courseId,
        userId: requestData?.userId,
      },
      include: {
        chapters: true,
      },
    });

    if (!courseOwner) {
      return new Response("Unauthorized user!", { status: 401 });
    }

    const fields = [
      !!courseOwner?.chapters?.some((chapter) => chapter?.isPublished),
      courseOwner?.categoryId,
      courseOwner?.description,
      courseOwner?.price,
      courseOwner?.imageUrl,
      courseOwner?.name,
    ];

    const isFieldCompleted = !!fields?.every(Boolean);

    if (!isFieldCompleted) {
      return new Response("all the fields are mandatory!", { status: 406 });
    }

    const publishDecision = !!courseOwner?.isPublish;

    const publishCourse = await prismadb?.course?.update({
      where: {
        id: courseId,
        userId: requestData?.userId,
      },
      data: {
        isPublish: !publishDecision,
      },
    });

    return NextResponse.json(publishCourse);
  } catch (error) {
    console.log(error);
    return new Response("Internal server Error!");
  }
};
