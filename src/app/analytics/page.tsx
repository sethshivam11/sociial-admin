import { StatsCard } from "@/components/StatsCard";
import { TrendingUp, Users, MessageCircle } from "lucide-react";
import { analytics } from "@/services/api";
import DataDistribution from "@/components/DataDistribution";
import { MessageChart } from "@/components/MessageChart";

export default async function AnalyticsPage() {
  const data = await analytics();

  const getTotal = (obj: { [key: string]: number }) => {
    if (!obj) return 0;
    return Object.values(obj)?.reduce(
      (item: number, acc: number) => item + acc,
      1,
    );
  };

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 lg:pl-68">
      <div className="mb-8 pt-12 lg:pt-0">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
          Analytics
        </h1>
        <p className="mt-1 text-muted-foreground">
          Detailed insights into your platform metrics
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatsCard
          title="Engagement"
          value={getTotal(data?.engagement)}
          icon={TrendingUp}
          breakdown={data?.engagement}
          className="animate-slide-up"
          style={{ animationDelay: "200ms" } as React.CSSProperties}
        />
        <StatsCard
          title="New Registrations"
          description="Last 30 days"
          value={data?.registrations?.newRegistrations || 0}
          trend={data?.registrations?.percentage}
          icon={Users}
          className="animate-slide-up"
        />
        <StatsCard
          title="Chats"
          value={getTotal(data?.chats)}
          breakdown={data?.chats}
          icon={MessageCircle}
          className="animate-slide-up"
          style={{ animationDelay: "300ms" } as React.CSSProperties}
        />
      </div>
      <MessageChart />
      <DataDistribution />
    </div>
  );
}
