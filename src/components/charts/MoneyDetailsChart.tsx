"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getMonthName } from "@/utils";

const chartConfig = {
  paidMoney: {
    label: "Paid",
    color: "hsl(333.3 71.4% 50.6%)",
  },
  totalMoney: {
    label: "Total",
    color: "hsl(330.4 81.2% 60.4%)",
  },
} satisfies ChartConfig;

type Props = {
  data: {
    currentMonthMoneyPaid: number;
    previousMonthMoneyPaid: number;
    currentMonthMoneyTotal: number;
    previousMonthMoneyTotal: number;
    percentageChange: number;
  };
};

export default function MoneyDetailsChart({ data }: Props) {
  const chartData = [
    {
      month: getMonthName(new Date().getMonth().toString()),
      total: data.previousMonthMoneyTotal,
      paid: data.previousMonthMoneyPaid,
    },
    {
      month: getMonthName((new Date().getMonth() + 1).toString()),
      total: data.currentMonthMoneyTotal,
      paid: data.currentMonthMoneyPaid,
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
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="total" fill="hsl(333.3 71.4% 50.6%)" radius={4} min={1} />
        <Bar dataKey="paid" fill="hsl(330.4 81.2% 60.4%)" radius={4} min={1} />
      </BarChart>
    </ChartContainer>
  );
}
