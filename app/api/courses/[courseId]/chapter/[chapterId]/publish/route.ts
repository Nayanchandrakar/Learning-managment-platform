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
      chapterId: string;
    };
  }
) => {
  try {
    const requestData = await getRequest();
    const { chapterId, courseId } = params;

    if (!requestData?.isApproved || !requestData?.userId) {
      return false;
    }

    const courseOwner = await prismadb?.course?.findUnique({
      where: {
        id: courseId,
        userId: requestData?.userId,
      },
    });

    if (!courseOwner) {
      return new Response("Unauthorized user!", { status: 401 });
    }

    if (
      !courseOwner?.name ||
      !courseOwner?.description ||
      !courseOwner?.imageUrl ||
      !courseOwner?.userId
    ) {
      return new Response("fill all the fields first", { status: 404 });
    }

    const chapter = await prismadb?.chapters?.findFirst({
      where: {
        courseId: courseOwner?.id,
        id: chapterId,
      },
    });

    if (!chapter) {
      return new Response("no chapter found ", { status: 405 });
    }

    if (!chapter?.description || !chapter?.title || !chapter?.videoUrl) {
      return new Response("please provide all  the fields first", {
        status: 403,
      });
    }

    const updatePublish = !!chapter?.isPublished ? false : true;

    const updateChapterToPublic = await prismadb?.chapters?.update({
      where: {
        id: chapter?.id,
        courseId: courseOwner?.id,
      },
      data: {
        isPublished: updatePublish,
      },
      select: {
        isPublished: true,
      },
    });

    return NextResponse.json(updateChapterToPublic);
  } catch (error) {
    console.log(error);
    return new Response("Internal server Error!");
  }
};
