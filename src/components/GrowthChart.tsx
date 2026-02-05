"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { CartesianGrid, Line, XAxis, LineChart, YAxis } from "recharts";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { growth } from "@/services/api";
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

interface GrowthChartProps {
  title: string;
  description?: string;
  loading: boolean;
  period: string;
  setPeriod: (value: string) => void;
  isError?: boolean;
  error?: Error | null;
  data: any[];
  color?: string;
}

function Growth({
  title,
  description,
  data,
  isError,
  error,
  period,
  setPeriod,
  loading = false,
  color = "hsl(346, 77%, 59%)",
}: GrowthChartProps) {
  const chartConfig = {
    count: {
      label: "Count",
      color,
    },
  } satisfies ChartConfig;

  const periodFormat = useMemo(() => {
    if (period === "weekly" || period === "daily") {
      return "d MMM";
    } else if (period === "monthly") {
      return "MMM";
    } else {
      return "yyyy";
    }
  }, [period]);

  return (
    <Card className="border-0 shadow-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Select value={period} onValueChange={(value) => setPeriod(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="daily">Daily</SelectItem>
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
          {loading ? (
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
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={data}
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
  );
}

export function GrowthChart({
  hide,
  className,
}: {
  hide?: "user" | "post";
  className?: string;
}) {
  const [period, setPeriod] = useState("weekly");

  const { data, isError, error, isLoading } = useQuery({
    queryKey: [`growth-${period}`],
    queryFn: () => growth(period),
    gcTime: 15 * 60 * 1000,
  });

  return (
    <div className={cn("mt-8 grid gap-6 lg:grid-cols-2", className)}>
      {hide !== "user" && (
        <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <Growth
            title="User Growth"
            description="Shows how the user base has grown over time"
            loading={isLoading}
            period={period}
            setPeriod={setPeriod}
            isError={isError}
            error={error}
            data={data?.user}
            color="hsl(346, 77%, 59%)"
          />
        </div>
      )}
      {hide !== "post" && (
        <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
          <Growth
            title="Post Growth"
            description="Trend of posts created over time"
            period={period}
            setPeriod={setPeriod}
            isError={isError}
            error={error}
            loading={isLoading}
            data={data?.post}
            color="hsl(280, 65%, 60%)"
          />
        </div>
      )}
    </div>
  );
}
