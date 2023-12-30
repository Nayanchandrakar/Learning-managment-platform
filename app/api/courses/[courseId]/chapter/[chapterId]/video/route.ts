import Mux from "@mux/mux-node";
import { getRequest } from "@/actions/getRequests";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { videoFormSchema } from "@/schema/zodSchema";
import { createMuxAsset, crudMuxData, deleteMux } from "@/actions/deleteMux";

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
    const body = await req?.json();
    const { chapterId, courseId } = params;

    const { videoUrl } = videoFormSchema.parse(body);

    if (!videoUrl) {
      return new Response("no video url provided", { status: 404 });
    }

    const requestData = await getRequest();

    if (!requestData?.isApproved || !requestData?.userId) {
      return new Response("Unauthorized user access!", { status: 401 });
    }

    const isExist = await prismadb?.muxData.findFirst({
      where: {
        chapterId,
      },
    });

    if (isExist?.playbackId) {
      const deletedMuxData = await deleteMux(isExist?.id, isExist?.assetId);

      const asset = await createMuxAsset(videoUrl);

      if (!asset?.assetId) {
        return new Response("check your mux data", { status: 402 });
      }

      const createMuxData = await crudMuxData(
        chapterId,
        courseId,
        videoUrl,
        asset
      );

      return NextResponse.json(createMuxData);
    }

    const asset = await createMuxAsset(videoUrl);

    if (!asset?.assetId) {
      return new Response("check your mux data", { status: 402 });
    }

    const createMuxData = await crudMuxData(
      chapterId,
      courseId,
      videoUrl,
      asset
    );

    return NextResponse.json(createMuxData);
  } catch (error) {
    console.log(error);
    return new Response("Internal server error", { status: 500 });
  }
};
