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
      chapterId: string;
    };
  }
) => {
  try {
    const { courseId, chapterId } = params;

    if (!courseId || !chapterId) {
      return new Response("please provide parameters", { status: 403 });
    }

    const requestData = await getRequest();

    if (!requestData?.isApproved || !requestData?.userId) {
      return new Response("Unauthorized user!", { status: 401 });
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

    const isChapterExists = await prismadb?.chapters?.findFirst({
      where: {
        courseId: courseOwner?.id,
      },
    });

    if (!isChapterExists) {
      return new Response("there is no chapter to delete", { status: 404 });
    }

    const deleteChapter = await prismadb?.chapters.delete({
      where: {
        id: isChapterExists?.id,
        courseId: isChapterExists?.courseId,
      },
      include: {
        muxData: {
          where: {
            chapterId: isChapterExists?.id,
          },
        },
      },
    });

    const deleteMuxAsset = await deleteMuxVideoAsset(
      deleteChapter?.muxData?.assetId!
    );

    return new Response("Chapter succefully deleted!", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal server error!");
  }
};
