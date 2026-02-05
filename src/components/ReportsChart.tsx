"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import {
  CartesianGrid,
  Line,
  XAxis,
  LineChart,
  YAxis,
  PieChart,
  Pie,
} from "recharts";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { growth, reportAnalytics } from "@/services/api";
import { format, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const trendConfig = {
  count: {
    label: "Count",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;
const distributionConfig = {
  chat: {
    label: "Chats",
    color: "var(--chart-1)",
  },
  post: {
    label: "Posts",
    color: "var(--chart-2)",
  },
  user: {
    label: "Users",
    color: "var(--chart-3)",
  },
  problem: {
    label: "Problems",
    color: "var(--chart-4)",
  },
  comment: {
    label: "Comments",
    color: "var(--chart-5)",
  },
  story: {
    label: "Stories",
    color: "oklch(71.5% 0.143 215.221)",
  },
  confession: {
    label: "Confessions",
    color: "oklch(90.5% 0.182 98.111)",
  },
} satisfies ChartConfig;

export function ReportsChart() {
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">(
    "weekly",
  );

  const periodFormat = useMemo(() => {
    if (period === "weekly") {
      return "d MMM";
    } else if (period === "monthly") {
      return "MMM";
    } else {
      return "yyyy";
    }
  }, [period]);

  const { data, isError, error, isLoading } = useQuery({
    queryKey: [`report-analytics-${period}`],
    queryFn: () => reportAnalytics(period),
    gcTime: 15 * 60 * 1000,
  });

  const reportDistribution = useMemo(() => {
    if (!data?.distribution || !Array.isArray(data?.distribution)) return [];
    return data?.distribution?.map((item: { _id: string }) => ({
      ...item,
      fill: `var(--color-${item?._id})`,
    }));
  }, [data]);

  return (
    <div className={cn("mt-8 grid gap-6 lg:grid-cols-2")}>
      <Card className="border-0 shadow-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">
                Reports Trend
              </CardTitle>
              <CardDescription>Reports created over time</CardDescription>
            </div>
            <Select
              value={period}
              onValueChange={(value: "weekly" | "monthly" | "yearly") =>
                setPeriod(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            {isLoading ? (
              <div className="grid place-content-center h-48">
                <Loader2 className="animate-spin" />
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center h-48">
                <AlertTriangle size="40" />
                <p className="text-xl font-semibold tracking-tight">
                  {error?.message || "Something went wrong"}
                </p>
              </div>
            ) : (
              <ChartContainer config={trendConfig}>
                <LineChart
                  accessibilityLayer
                  data={data?.trend}
                  margin={{
                    left: 32,
                    right: 12,
                    top: 16,
                    bottom: 8,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="_id"
                    tickFormatter={(value) =>
                      format(parseISO(value), periodFormat)
                    }
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                    tickMargin={8}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) =>
                          format(
                            parseISO(value),
                            period === "yearly"
                              ? "yyyy"
                              : period === "monthly"
                                ? "MMMM, yyyy"
                                : "dd MMMM",
                          )
                        }
                        hideIndicator
                      />
                    }
                    cursor={false}
                  />
                  <Line
                    dataKey="count"
                    type="natural"
                    stroke="var(--color-count)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </div>
        </CardContent>
      </Card>
      <Card
        className="border-0 shadow-card animate-slide-up"
        style={{ animationDelay: "600ms" }}
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Report Distribution
          </CardTitle>
          <CardDescription>
            Breakdown of reports across multiple formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={distributionConfig}
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
                <Pie data={reportDistribution} nameKey="_id" dataKey="count" />
              </PieChart>
            )}
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground w-3/4 mx-auto">
            <div className="space-x-1">
              <div className="h-3 w-3 inline-block rounded bg-chart-1" />
              <span>Chats</span>
            </div>
            <div className="space-x-1">
              <div className="h-3 w-3 inline-block rounded bg-chart-2" />
              <span>Posts</span>
            </div>
            <div className="space-x-1">
              <div className="h-3 w-3 inline-block rounded bg-chart-3" />
              <span>Users</span>
            </div>
            <div className="space-x-1">
              <div className="h-3 w-3 inline-block rounded bg-chart-4" />
              <span>Problems</span>
            </div>
            <div className="space-x-1">
              <div className="h-3 w-3 inline-block rounded bg-chart-5" />
              <span>Comments</span>
            </div>
            <div className="space-x-1">
              <div className="h-3 w-3 inline-block rounded bg-cyan-500" />
              <span>Stories</span>
            </div>
            <div className="space-x-1">
              <div className="h-3 w-3 inline-block rounded bg-yellow-300" />
              <span>Confessions</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
