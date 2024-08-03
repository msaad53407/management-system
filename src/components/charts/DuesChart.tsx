"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  dues: {
    label: "Dues",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

type Props =
  | {
      duesType: "paid";
      paidDues: number;
      totalDues: number;
      month: string;
      year: string;
    }
  | {
      duesType: "total";
      paidDues?: never;
      totalDues: number;
      month: string;
      year: string;
    }
  | {
      duesType: "delinquent";
      delinquentDues: number;
      totalDues: number;
      month: string;
      year: string;
    };

export default function DuesChart(props: Props) {
  const progress =
    props.duesType === "total"
      ? 0
      : props.duesType === "delinquent"
      ? 360 - Math.ceil((props.delinquentDues / props.totalDues) * 360)
      : Math.ceil((props.paidDues / props.totalDues) * 360);

  const chartData = [
    {
      browser: "safari",
      dues:
        props.duesType === "paid"
          ? props.paidDues
          : props.duesType === "total"
          ? props.totalDues
          : props.delinquentDues,
      fill: "var(--color-safari)",
    },
  ];

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>
          {props.duesType === "paid"
            ? "Received"
            : props.duesType === "delinquent"
            ? "Delinquent"
            : "Total"}{" "}
          Dues $
        </CardTitle>
        {props.duesType !== "delinquent" && (
          <CardDescription>
            {props.month} {props.year}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={360}
            endAngle={progress}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="dues" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].dues.toLocaleString() + "$"}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {props.duesType === "paid"
                            ? "Received"
                            : props.duesType === "total"
                            ? "Total"
                            : "Delinquent"}{" "}
                          Dues
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          {props.duesType === "paid"
            ? `Showing Total Dues Received for ${props.month}`
            : props.duesType === "total"
            ? `Showing Total ${props.duesType} Dues for ${props.month}`
            : `Showing Total Delinquent Dues for more than 30 days`}
        </div>
      </CardFooter>
    </Card>
  );
}
