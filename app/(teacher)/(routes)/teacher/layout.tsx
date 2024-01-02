import { getRequest } from "@/actions/getRequests";
import { redirect } from "next/navigation";

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
  const teacherMode = await getRequest();

  if (!teacherMode?.isApproved) {
    return redirect("/");
  }

  return <>{children}</>;
};

export default TeacherLayout;
