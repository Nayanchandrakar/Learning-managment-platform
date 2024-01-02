import Container from "@/components/shared/container";
import CardData from "./_components/card-data";
import { DollarSign } from "lucide-react";
import Overview from "./_components/overview";
import { getCharts } from "@/actions/getCharts";
import { getPrice } from "@/lib/price-format";

const CoursePage = async () => {
  const { data, totalRevenue, totalSales } = await getCharts();

  return (
    <Container className="sm:my-8 my-5">
      <div className="p-8 border border-zinc-200 rounded-lg">
        {/* cards div  */}
        <div className="flex flex-col md:flex-row gap-4 items-center w-full  h-fit">
          <CardData
            Icon={DollarSign}
            data={getPrice?.format(totalRevenue)}
            title="Total sales"
          />

          <CardData Icon={DollarSign} data={totalSales} title="Total sales" />
        </div>

        {/* charts div  */}
        <div className="mt-8">
          <Overview data={data} />
        </div>
      </div>
    </Container>
  );
};

export default CoursePage;
