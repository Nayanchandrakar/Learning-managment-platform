"use client";

import { FC } from "react";
import { Course } from "@prisma/client";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OverviewProps {
  data: Course[];
}

const Overview: FC<OverviewProps> = ({ data }) => {
  const courseSells = data?.map((course) => ({
    name: course?.name,
    total: course?.price,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={courseSells}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-lime-400"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Overview;
