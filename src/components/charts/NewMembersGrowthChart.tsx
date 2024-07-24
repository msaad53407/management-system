"use client";

import { Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MonthlyMemberGrowthAggregation } from "@/types/globals";

const chartConfig = {
  members: {
    label: "Members",
  },
  currentMonthCount: {
    label: "Current Month",
    color: "hsl(var(--chart-1))",
  },
  previousMonthCount: {
    label: "Previous Month",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Props = {
  data: MonthlyMemberGrowthAggregation;
};

export default function NewMembersGrowthChart({ data }: Props) {
  const chartData = [
    {
      memberType: "currentMonthCount",
      members: data.currentMonthCount,
      fill: "hsl(333.3 71.4% 50.6%)",
    },
    {
      memberType: "previousMonthCount",
      members: data.previousMonthCount,
      fill: "hsl(330.4 81.2% 60.4%)",
    },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie data={chartData} dataKey="members" nameKey="memberType" />
      </PieChart>
    </ChartContainer>
  );
}
