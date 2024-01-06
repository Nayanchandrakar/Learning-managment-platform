import { getRequest } from "@/actions/getRequests";
import { deleteMuxVideoAsset } from "@/actions/muxAction";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const DELETE = async (
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
    const requestData = await getRequest();
    const { courseId } = params;

    if (!requestData?.isApproved || !requestData?.userId) {
      return new Response("Unauthorized user!", { status: 401 });
    }

    const courseOwner = await prismadb?.course?.findFirst({
      where: {
        id: courseId,
        userId: requestData?.userId,
      },
    });

    if (!courseOwner) {
      return new Response("Unauthorized user!", { status: 401 });
    }

    const chapters = await prismadb?.chapters?.findMany({
      where: {
        courseId: courseOwner?.id,
        isPublished: true,
      },
      include: { muxData: true },
    });

    if (chapters?.some((chapter) => !!chapter?.isPublished)) {
      return new Response(
        "please first unpublish all the chapters to delete this course ",
        { status: 405 }
      );
    }

    chapters?.map(async (chapter) => {
      if (chapter?.muxData?.assetId) {
        return await deleteMuxVideoAsset(chapter?.muxData?.assetId);
      }
      return null;
    });

    const deleteChapters = await prismadb?.course?.delete({
      where: {
        userId: requestData?.userId,
        id: courseId,
      },
    });

    return NextResponse.json(deleteChapters);
  } catch (error) {
    console.log(error);
    return new Response("Internal server Error!");
  }
};
