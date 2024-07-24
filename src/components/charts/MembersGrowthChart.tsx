"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CurrentYearMemberGrowthAggregation } from "@/types/globals";
import { getMonthName } from "@/utils";

const chartConfig = {
  count: {
    label: "Members Count",
    color: "hsl(333.3 71.4% 50.6%)",
  },
} satisfies ChartConfig;

type Props = {
  data: CurrentYearMemberGrowthAggregation;
};

export default function MembersGrowthChart({ data }: Props) {
  const chartData = data.map(({ month, count }) => ({
    month: getMonthName(month.toString()),
    count,
  }));

  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Line
          dataKey="count"
          type="natural"
          stroke="hsl(333.3 71.4% 50.6%)"
          strokeWidth={2}
          dot={{
            fill: "hsl(333.3 71.4% 50.6%)",
          }}
          activeDot={{
            r: 6,
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}
