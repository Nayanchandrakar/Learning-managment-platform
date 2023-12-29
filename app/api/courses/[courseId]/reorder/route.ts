import { NextResponse } from "next/server";
import { getRequest } from "@/actions/getRequests";
import prismadb from "@/lib/prismadb";
import { valuesListInterface } from "@/types/types";

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
    const { title } = await req?.json();

    const requestData = await getRequest();

    if (!requestData?.isApproved || !requestData?.userId) {
      return new Response("Unauthorized user", { status: 401 });
    }

    const lastChapter = await prismadb?.chapters.findFirst({
      where: {
        courseId: params?.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await prismadb.chapters.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log(`ERROR_FROM_REORDER`, error);
    return new Response("Internal server error", { status: 500 });
  }
};

export const PUT = async (
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
    const { valuesList } = await req?.json();

    const list: valuesListInterface[] = valuesList;

    const requestData = await getRequest();

    if (!requestData?.isApproved || !requestData?.userId) {
      return new Response("Unauthorized user", { status: 401 });
    }

    const isCourseOwner = await prismadb?.course?.findUnique({
      where: {
        userId: requestData?.userId,
        id: params?.courseId,
      },
    });

    if (!isCourseOwner) {
      return new Response("Unauthorized", { status: 401 });
    }

    for (let items of list) {
      await prismadb?.chapters?.update({
        where: {
          id: items?.id,
        },
        data: {
          position: items?.position,
        },
      });
    }

    return NextResponse.json(isCourseOwner);
  } catch (error) {
    console.log(`ERROR_FROM_REORDER`, error);
    return new Response("Internal server error", { status: 500 });
  }
};
