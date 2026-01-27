"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/api";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useMemo } from "react";

const loginConfig = {
  local: {
    label: "Local",
    color: "var(--chart-1)",
  },
  google: {
    label: "Google",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function LoginDistribution() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["getUsers"],
    queryFn: getUsers,
    gcTime: 15 * 60 * 1000,
  });

  const loginData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [{ local: 4, google: 12 }];
    const local = data.reduce((acc, item) => {
      if (item?.loginType === "local") return acc + 1;
      else return acc;
    }, 0);
    const google = data.reduce((acc, item) => {
      if (item?.loginType === "google") return acc + 1;
      else return acc;
    }, 0);
    return [{ local, google }];
  }, [data]);

  const totalCount = loginData[0]?.local + loginData[0]?.google || 0;

  return (
    <Card className="border-0 shadow-card my-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Login Type</CardTitle>
        <CardDescription>
          Distribution of authentication methods used by users
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
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
          <ChartContainer
            config={loginConfig}
            className="mx-auto aspect-square max-h-62.5"
          >
            <RadialBarChart
              data={loginData}
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
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalCount}
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
                dataKey="local"
                stackId="a"
                cornerRadius={5}
                fill="var(--color-local)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="google"
                fill="var(--color-google)"
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
      {!isLoading && (
        <CardFooter>
          <div className="flex items-center justify-center gap-3 w-full text-sm text-muted-foreground">
            <div className="space-x-1">
              <div className="h-3 w-3 inline-block rounded bg-chart-1" />
              <span>Local</span>
            </div>
            <div className="space-x-1">
              <div className="h-3 w-3 inline-block rounded bg-chart-2" />
              <span>Google</span>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export default LoginDistribution;
