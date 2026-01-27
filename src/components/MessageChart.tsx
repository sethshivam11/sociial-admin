"use client"

import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { format, parseISO } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import { messageAnalytics } from "@/services/api"
import { AlertTriangle, Loader2 } from "lucide-react"

const messageTypeConfig = {
  count: {
    label: "Count",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const messageTrendConfig = {
  count: {
    label: "Count",
    color: "var(--chart-2)"
  }
} satisfies ChartConfig

export function MessageChart() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["message-analytics"],
    queryFn: messageAnalytics,
    gcTime: 15 * 60 * 1000,
  });

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-0 shadow-card animate-slide-up">
        <CardHeader>
          <CardTitle>Messages Trend</CardTitle>
          <CardDescription>Tracks message activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="flex items-center justify-center h-68">
            <Loader2 className="animate-spin" />
          </div> : isError ? <div className="flex flex-col items-center justify-center h-68">
            <AlertTriangle size="40" />
            <p className="text-xl font-semibold tracking-tight">
              {error?.message || "Something went wrong"}
            </p>
          </div> : <ChartContainer config={messageTrendConfig}>
            <LineChart
              accessibilityLayer
              data={data?.trend}
              margin={{
                top: 20,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="_id"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => format(parseISO(value), "MMM yy")}
                interval="preserveStartEnd"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
                labelFormatter={(value) => format(parseISO(value), "MMMM yyyy")}
              />
              <Line
                dataKey="count"
                type="natural"
                stroke="var(--color-count)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-count)",
                }}
                activeDot={{
                  r: 6,
                }}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Line>
            </LineChart>
          </ChartContainer>}
        </CardContent>


      </Card>
      <Card className="border-0 shadow-card animate-slide-up">
        <CardHeader>
          <CardTitle>Messages Breakdown</CardTitle>
          <CardDescription>Distribution of message types</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <div className="flex items-center justify-center h-68">
            <Loader2 className="animate-spin" />
          </div> : isError ? <div className="flex flex-col items-center justify-center h-68">
            <AlertTriangle size="40" />
            <p className="text-xl font-semibold tracking-tight">
              {error?.message || "Something went wrong"}
            </p>
          </div> : <ChartContainer config={messageTypeConfig}>
            <BarChart
              accessibilityLayer
              data={data?.type}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="_id"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 1).toUpperCase() + value.slice(1)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>}
        </CardContent>
      </Card>
    </div>
  )
}
