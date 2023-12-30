import { getRequest } from "@/actions/getRequests";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { Video } = new Mux(
  process.env.MUX_ACCESS_TOKEN_ID!,
  process.env.MUX_SECRET_ID!
);

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

export const POST = async (
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
    const { chapterId, courseId } = params;

    if (!values) {
      return new Response("please pass  a value to update!", { status: 405 });
    }

    const requestData = await getRequest();

    if (!requestData?.isApproved && !requestData?.userId) {
      return new Response("Unauthorized user access!", { status: 401 });
    }

    if (values?.videoUrl) {
      const chapterVideo = await prismadb?.chapters?.findFirst({
        where: {
          id: chapterId,
          courseId,
        },
        include: {
          muxData: true,
        },
      });

      if (!chapterVideo) {
        return new Response("Not found", { status: 404 });
      }

      const updateChapter = await prismadb?.chapters?.update({
        where: {
          id: chapterId,
          courseId,
        },
        data: {
          videoUrl: values?.videoUrl,
        },
      });

      if (!chapterVideo?.muxData?.playbackId) {
        const asset = await Video.Assets.create({
          input: values.videoUrl,
          playback_policy: "public",
          test: false,
        });

        const createMuxData = await prismadb?.muxData?.create({
          data: {
            chapterId: chapterVideo?.id,
            assetId: asset?.id,
            playbackId: asset?.playback_ids?.[0]?.id,
          },
        });
      } else {
        await Video.Assets.del(chapterVideo?.muxData?.assetId);

        const asset = await Video.Assets.create({
          input: values.videoUrl,
          playback_policy: "public",
          test: false,
        });

        await prismadb.muxData.update({
          where: {
            id: chapterVideo?.muxData?.id,
            chapterId: chapterVideo?.id,
          },
          data: {
            chapterId: chapterVideo?.id,
            assetId: asset?.id,
            playbackId: asset?.playback_ids?.[0]?.id,
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    return new Response("Internal server error", { status: 500 });
  }
};
