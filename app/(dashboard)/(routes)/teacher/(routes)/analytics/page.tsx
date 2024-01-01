import Container from "@/components/shared/container";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { DataTable } from "./_components/data-table";
import { columns, courseType } from "./_components/columns";
import { getPrice } from "@/lib/price-format";

const AnalyticsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await prismadb?.course?.findMany({
    where: {
      userId,
    },
  });

  const data: courseType[] = courses?.map((course) => ({
    id: course?.id,
    title: course?.name,
    price: getPrice?.format(course?.price!) || 0,
    status: course?.isPublish,
  }));

  return (
    <Container className="my-12">
      <DataTable columns={columns} data={data} />
    </Container>
  );
};

export default AnalyticsPage;
