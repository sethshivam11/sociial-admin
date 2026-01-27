import { UserTable } from "@/components/UserTable";
import { StatsCard } from "@/components/StatsCard";
import { Users, UserCheck, Cable } from "lucide-react";
import { userStats } from "@/services/api";
import { GrowthChart } from "@/components/GrowthChart";
import LoginDistribution from "@/components/LoginDistribution";
import { StatsCardProps } from "@/lib/types";

export default async function UsersPage() {
  const data = await userStats();

  const statsCards: StatsCardProps[] = [
    {
      title: "Total Users",
      value: data?.total || 0,
      breakdown: {
        verified: data?.total - data?.unverified || 0,
        unverified: data?.unverified || 0,
      },
      icon: Users,
    },
    {
      title: "Active Users",
      value: data?.active?.current || 0,
      trend: data?.active?.change || 0,
      icon: UserCheck,
    },
    {
      title: "Connected Users",
      value: data?.connected?.total || 0,
      trend: data?.connected?.change || 0,
      icon: Cable
    }
  ];

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 lg:pl-68">
      <div className="mb-8 pt-12 lg:pt-0">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
          User Management
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage and monitor your platform users
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {statsCards.map((card, index) => (
          <StatsCard key={index} className="animate-slide-up" {...card} />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <GrowthChart className="lg:grid-cols-1 lg:mb-8" hide="post" />
        <LoginDistribution />
      </div>
      <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
        <UserTable />
      </div>
    </div>
  );
}
