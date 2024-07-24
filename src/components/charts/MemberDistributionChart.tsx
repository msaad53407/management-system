"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  members: {
    label: "Total Members",
  },
  regular: {
    label: "Regular",
    color: "hsl(var(--chart-1))",
  },
  special: {
    label: "Special",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Props = {
  data: {
    regularMembersCount: number;
    specialMembersCount: number;
  };
};

export default function MemberDistributionChart({ data }: Props) {
  const chartData = [
    {
      memberType: "regular",
      members: data.regularMembersCount,
      fill: "hsl(333.3 71.4% 50.6%)",
    },
    {
      memberType: "special",
      members: data.specialMembersCount,
      fill: "hsl(330.4 81.2% 60.4%)",
    },
  ];
  const totalMembers = data.regularMembersCount + data.specialMembersCount;

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
        <Pie
          data={chartData}
          dataKey="members"
          nameKey="memberType"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalMembers.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Member(s)
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
