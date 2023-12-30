import Mux from "@mux/mux-node";
import prismadb from "@/lib/prismadb";

const { Video } = new Mux(
  process.env.MUX_ACCESS_TOKEN_ID!,
  process.env.MUX_SECRET_ID!
);

export const deleteMux = async (muxId: string, assetId: string) => {
  try {
    const deletedMuxData = await prismadb?.muxData?.delete({
      where: {
        id: muxId,
      },
    });

    const deletedMuxVideo = await Video?.Assets?.del(assetId);
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
