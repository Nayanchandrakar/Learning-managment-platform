import prismadb from "@/lib/prismadb";
import { Attachments, Chapters } from "@prisma/client";

export const getChapters = async (
  userId: string,
  chapterId: string,
  courseId: string
) => {
  try {
    const purchase = await prismadb.purchase?.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const course = await prismadb?.course?.findUnique({
      where: {
        id: courseId,
        isPublish: true,
      },
      select: {
        price: true,
      },
    });

    const chapter = await prismadb.chapters.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    if (!chapter || !course) {
      throw new Error("Chapter or course not found");
    }

    let Attachments: Attachments[] = [];
    let muxData = null;
    let nexChapter: Chapters | null = null;

    if (purchase) {
      Attachments = await prismadb?.attachments?.findMany({
        where: {
          courseId,
        },
      });
    }

    if (chapter?.isFree || purchase) {
      muxData = await prismadb?.muxData?.findUnique({
        where: {
          chapterId,
        },
      });

      nexChapter = await prismadb?.chapters?.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
      });
    }

    const userProgress = await prismadb.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    return {
      chapter,
      course,
      muxData,
      Attachments,
      nexChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    return {
      chapter: null,
      course: null,
      muxData: null,
      Attachments: [],
      nexChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
