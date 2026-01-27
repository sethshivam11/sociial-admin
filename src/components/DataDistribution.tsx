"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { contentDistribution } from "@/services/api";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

const engagementConfig = {
  posts: {
    label: "Posts",
    color: "var(--chart-1)",
  },
  videos: {
    label: "Videos",
    color: "var(--chart-2)",
  },
  comments: {
    label: "Comments",
    color: "var(--chart-3)",
  },
  calls: {
    label: "Calls",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;
const callsConfig = {
  audio: {
    label: "Audio Calls",
    color: "var(--chart-1)",
  },
  video: {
    label: "Video Calls",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function DataDistribution() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["contentDistribution"],
    queryFn: contentDistribution,
    gcTime: 15 * 60 * 1000,
  });

  const engagementData = [
    {
      name: "posts",
      value: data?.posts,
      fill: "var(--color-posts)",
    },
    {
      name: "videos",
      value: data?.videos,
      fill: "var(--color-videos)",
    },
    {
      name: "comments",
      value: data?.comments,
      fill: "var(--color-comments)",
    },
    {
      name: "calls",
      value: data?.calls,
      fill: "var(--color-calls)",
    },
  ];
  const callsData = [data?.callsDistribution || { audio: 0, video: 0 }];
  const totalCalls = callsData[0]?.audio + callsData[0]?.video || 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-6">
      <Card
        className="border-0 shadow-card animate-slide-up"
        style={{ animationDelay: "600ms" }}
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Content Distribution
          </CardTitle>
          <CardDescription>
            Breakdown of content across multiple formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={engagementConfig}
            className="mx-auto aspect-square max-h-62.5"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-68">
                <Loader2 className="animate-spin" />
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center h-68">
                <AlertTriangle size="40" />
                <p className="text-xl font-semibold tracking-tight">
                  {error?.message || "Something went wrong"}
                </p>
              </div>
            ) : (
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie data={engagementData} dataKey="value" nameKey="name" />
              </PieChart>
            )}
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-center gap-3 w-full text-sm text-muted-foreground">
            <div className="space-x-1">
              <div className="h-3 w-3 inline-block rounded bg-chart-1" />
              <span>Posts</span>
            </div>
            <div className="space-x-1">
              <div className="h-3 w-3 inline-block rounded bg-chart-2" />
              <span>Videos</span>
            </div>
            <div className="space-x-1">
              <div className="h-3 w-3 inline-block rounded bg-chart-3" />
              <span>Comments</span>
            </div>
            <div className="space-x-1">
              <div className="h-3 w-3 inline-block rounded bg-chart-4" />
              <span>Calls</span>
            </div>
          </div>
        </CardFooter>
      </Card>
      <Card
        className="border-0 shadow-card animate-slide-up"
        style={{ animationDelay: "700ms" }}
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Calls Distribution
          </CardTitle>
          <CardDescription>
            Audio and Video call Distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={callsConfig}
            className="mx-auto aspect-square max-h-62.5"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-68">
                <Loader2 className="animate-spin" />
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center h-68">
                <AlertTriangle size="40" />
                <p className="text-xl font-semibold tracking-tight">
                  {error?.message || "Something went wrong"}
                </p>
              </div>
            ) : (
              <RadialBarChart
                data={callsData}
                endAngle={180}
                innerRadius={80}
                outerRadius={130}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 16}
                              className="fill-foreground text-2xl font-bold"
                            >
                              {totalCalls}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 4}
                              className="fill-muted-foreground"
                            >
                              Calls
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
                <RadialBar
                  dataKey="audio"
                  stackId="a"
                  cornerRadius={5}
                  fill="var(--color-audio)"
                  className="stroke-transparent stroke-2"
                />
                <RadialBar
                  dataKey="video"
                  fill="var(--color-video)"
                  stackId="a"
                  cornerRadius={5}
                  className="stroke-transparent stroke-2"
                />
              </RadialBarChart>
            )}
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-center gap-3 w-full text-sm text-muted-foreground">
            <div className="space-x-1">
              <div className="h-3 w-3 inline-block rounded bg-chart-1" />
              <span>Audio</span>
            </div>
            <div className="space-x-1">
              <div className="h-3 w-3 inline-block rounded bg-chart-2" />
              <span>Video</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default DataDistribution;
