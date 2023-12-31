import BackButton from "@/components/shared/back-button";
import Container from "@/components/shared/container";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { Banner } from "@/components/shared/alert-banner";
import ChapterTitle from "./_components/chapter-title-field";
import ChapterDescription from "./_components/chapter-description";
import ChapterPreview from "./_components/chapter-preview";
import ChapterHeaderActions from "./_components/chapter-header-actions";
import ChapterVideoUpload from "./_components/chapter-video-action";

const CourseIdPage = async ({
  params,
}: {
  params: {
    courseId: string;
    chapterId: string;
  };
}) => {
  const { courseId, chapterId } = params;

  const chapter = await prismadb.chapters.findFirst({
    where: {
      id: chapterId,
      courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    redirect("/");
  }

  const fields = [
    chapter?.title,
    chapter?.description,
    chapter?.muxData?.playbackId,
  ];

  const totalFields = fields?.length;
  const completedFields = fields?.filter(Boolean).length;

  const courseHeaderText = `Complete all fields (${completedFields}/${totalFields})`;

  const isFieldsCompleted = !!fields?.every(Boolean);

  return (
    <>
      {!chapter?.isPublished && (
        <Banner label="This chapter is unpublished. It will not be visible to the students." />
      )}

      <div className="my-3 sm:my-4">
        <BackButton />
      </div>

      <Container className="mb-12">
        <ChapterHeaderActions
          headerText={courseHeaderText}
          check={isFieldsCompleted}
          chapter={chapter}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[55%_45%] gap-x-6">
          {/* course div 1 */}
          <div className="space-y-5">
            <ChapterTitle chapter={chapter} />
            <ChapterDescription chapter={chapter} />
            <ChapterPreview chapter={chapter} />
          </div>

          <div className="space-y-5">
            <ChapterVideoUpload chapter={chapter} />
          </div>
        </div>
      </Container>
    </>
  );
};

export default CourseIdPage;
