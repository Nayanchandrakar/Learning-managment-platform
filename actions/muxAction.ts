import Mux from "@mux/mux-node";
import prismadb from "@/lib/prismadb";
import { getRequest } from "./getRequests";

const { Video } = new Mux(
  process.env.MUX_ACCESS_TOKEN_ID!,
  process.env.MUX_SECRET_ID!
);

export const deleteMuxVideoAsset = async (assetId: string) => {
  try {
    const deletedMuxVideo = await Video?.Assets?.del(assetId);

    return true;
  } catch (error) {
    return false;
  }
};

export const deleteMux = async (muxId: string, assetId: string) => {
  try {
    const deletedMuxData = await prismadb?.muxData?.delete({
      where: {
        id: muxId,
      },
    });

    const deletedMuxVideo = await deleteMuxVideoAsset(assetId);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const createMuxAsset = async (videoUrl: string) => {
  try {
    const newMuxVideo = await Video?.Assets?.create?.({
      input: videoUrl,
      playback_policy: "public",
      test: false,
    });

    return {
      assetId: newMuxVideo?.id,
      playbackId: newMuxVideo?.playback_ids?.[0]?.id,
    };
  } catch (error) {
    console.log(error);
    return {
      assetId: null,
      playbackId: null,
    };
  }
};

export const crudMuxData = async (
  chapterId: string,
  courseId: string,
  videoUrl: string,
  asset: {
    assetId: string | null | undefined;
    playbackId: string | null | undefined;
  }
) => {
  try {
    const updateChaptersVideoUrl = await prismadb?.chapters?.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        videoUrl,
      },
    });

    const createMuxData = await prismadb?.muxData?.create({
      data: {
        assetId: asset?.assetId!,
        playbackId: asset?.playbackId!,
        chapterId: updateChaptersVideoUrl?.id,
      },
    });

    return true;
  } catch (error) {
    return false;
  }
};

export const uploadMuxData = async (
  courseId: string,
  chapterId: string,
  videoUrl: string
) => {
  try {
    if (!courseId || !chapterId || !videoUrl) return false;

    const requestData = await getRequest();

    if (!requestData?.isApproved || !requestData?.userId) {
      return false;
    }

    const isExist = await prismadb?.muxData.findFirst({
      where: {
        chapterId,
      },
    });

    console.info(isExist, "isExist");

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

      return true;
    }

    const asset = await createMuxAsset(videoUrl);

    console.info(asset, "asset");

    if (!asset?.assetId) {
      return false;
    }

    const createMuxData = await crudMuxData(
      chapterId,
      courseId,
      videoUrl,
      asset
    );

    console.info(createMuxData, "createMuxData");

    return true;
  } catch (error) {
    return false;
  }
};
