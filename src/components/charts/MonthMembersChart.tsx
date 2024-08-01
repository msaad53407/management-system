"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MonthlyMemberGrowthAggregation } from "@/types/globals";
import { getMonth, getMonthName } from "@/utils";

const chartConfig = {
  members: {
    label: "Members",
  },
} satisfies ChartConfig;

type Props = {
  data: MonthlyMemberGrowthAggregation;
  date: {
    month?: string;
    year?: string;
  };
};

export default function MonthMembersChart({ data, date }: Props) {
  const chartData = [
    {
      month: getMonthName(
        date?.month ? (Number(date.month) - 1).toString() : new Date().getMonth().toString()
      ),
      members: data.previousMonthCount,
    },
    {
      month: getMonthName(date?.month ? date.month : (new Date().getMonth() + 1).toString()),
      members: data.currentMonthCount,
    },
  ];

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="members" fill="hsl(333.3 71.4% 50.6%)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
