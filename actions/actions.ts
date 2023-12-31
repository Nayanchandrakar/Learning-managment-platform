"use server";

import { revalidatePath } from "next/cache";
import { uploadMuxData } from "./muxAction";

export const uploadVideoMux = async (
  courseId: string,
  chapterId: string,
  videoUrl: string
) => {
  return await uploadMuxData(courseId, chapterId, videoUrl);
};

export const prefetchServer = async (endpoint: string) =>
  revalidatePath(endpoint);
