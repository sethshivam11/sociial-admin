import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { StatsCardProps } from "@/lib/types";

export function StatsCard({
  title,
  description,
  value,
  icon: Icon,
  breakdown,
  trend,
  className,
  iconClassName,
  style,
}: StatsCardProps) {
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <Card
      className={cn(
        "overflow-hidden ring ring-muted-foreground/40 bg-muted-foreground/10 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 border-0 shadow-card",
        className,
      )}
      style={style}
    >
      <CardContent className="">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {formattedValue}
              </p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <div
              className={cn(
                "rounded-lg p-0.5 flex items-center justify-center bg-linear-to-br from-red-500 via-blue-500 to-green-500",
                iconClassName,
              )}
            >
              <div className="p-2 bg-secondary rounded-md">
                <Icon className="h-5 w-5 text-foreground" />
              </div>
            </div>
          </div>
          {breakdown && (
            <div className="flex items-center justify-between gap-2">
              {Object.entries(breakdown)?.map((item, index) => (
                <ul className="flex justify-around flex-col" key={index}>
                  <li className="font-medium tracking-tight">{item[1]}</li>
                  <li className="capitalize text-muted-foreground text-sm">
                    {item[0]}
                  </li>
                </ul>
              ))}
            </div>
          )}
          {trend !== null && trend !== undefined && (
            <div
              className={`flex items-center gap-1 text-sm ${trend > 0 ? "text-green-600" : "text-destructive"}`}
            >
              {trend > 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span>{trend.toFixed(0)}%</span> from last month
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
