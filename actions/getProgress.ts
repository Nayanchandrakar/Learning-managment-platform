import prismadb from "@/lib/prismadb";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await prismadb.chapters?.findMany({
      where: {
        id: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChapterIds = publishedChapters?.map(
      (chapter) => chapter?.id
    );

    const validCompletedChapters = await prismadb?.userProgress.count({
      where: {
        userId,
        isCompleted: true,
        chapterId: {
          in: publishedChapterIds,
        },
      },
    });

    const progress =
      (validCompletedChapters / publishedChapterIds?.length) * 100;

    return progress;
  } catch (error) {
    return 0;
  }
};
