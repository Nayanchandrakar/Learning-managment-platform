import { getRequest } from "@/actions/getRequests";
import { redirect } from "next/navigation";

const TeacherPage = async () => {
  const teacherMode = await getRequest();

  if (!teacherMode?.isApproved) {
    return redirect("/");
  }

  return <div className="">hello</div>;
};

export default TeacherPage;
