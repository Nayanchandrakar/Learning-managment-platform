import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ChapterIdPage = async ({
  params,
}: {
  params: { chapterId: string; courseId: string };
}) => {
  const { userId } = auth();
  const { courseId, chapterId } = params;

  if (!userId) {
    return redirect("/");
  }

  // find that course with their chapters

  return <div>ChapterIdPage</div>;
};

export default ChapterIdPage;
