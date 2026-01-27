import { StatsCard } from "@/components/StatsCard";
import { GrowthChart } from "@/components/GrowthChart";
import { UserTable } from "@/components/UserTable";
import { ReportsTable } from "@/components/ReportsTable";
import { Users, Image, MessageCircle } from "lucide-react";
import { dashboard } from "@/services/api";
import { StatsCardProps } from "@/lib/types";

export default async function Index() {
  const data = await dashboard();

  const statsCards: StatsCardProps[] = [
    {
      title: "Total Posts",
      value: data?.posts?.total - data?.posts?.videos || 0,
      breakdown: {
        posts: data?.posts?.total - data?.posts?.videos || 0,
        videos: data?.posts?.videos || 0,
      },
      icon: Image,
    },
    {
      title: "Total Likes",
      value: data?.likes?.total || 0,
      trend: data?.likes?.change,
      icon: Users,
    },
    {
      title: "Total Comments",
      value: data?.comments?.total || 0,
      trend: data?.comments?.change,
      icon: MessageCircle,
    },
  ];

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 lg:pl-68">
      <div className="mb-8 pt-12 lg:pt-0">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your platform's performance
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {statsCards.map((stat, index) => (
          <StatsCard key={stat.title} className="animate-slide-up" {...stat} />
        ))}
      </div>
      <GrowthChart />
      <div className="mt-8 space-y-8">
        <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
          <ReportsTable />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: "500ms" }}>
          <UserTable />
        </div>
      </div>
    </div>
  );
}
