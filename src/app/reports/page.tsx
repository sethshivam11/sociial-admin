import { GrowthChart } from "@/components/GrowthChart";
import { ReportsChart } from "@/components/ReportsChart";
import { ReportsTable } from "@/components/ReportsTable";
import { StatsCard } from "@/components/StatsCard";
import { getReports, reportAnalytics, reportsOverview } from "@/services/api";
import { AxiosError } from "axios";
import {
  Flag,
  Image,
  MessageCircle,
  UsersRound,
  Mail,
  CircleDashed,
  OctagonAlert,
  MessageSquareHeart,
} from "lucide-react";
import { toast } from "sonner";

interface Report {
  kind: string;
}

export default async function ReportsPage() {
  const data = await reportsOverview();

  const totalReports = Object.values(data?.distribution).reduce(
    (acc: number, item) => Number(item) + acc,
    0,
  );

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 lg:pl-68">
      <div className="mb-8 pt-12 lg:pt-0">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
          Reports
        </h1>
        <p className="mt-1 text-muted-foreground">
          Review and manage reported content
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatsCard
          title="Total Reports"
          value={totalReports || 0}
          icon={Flag}
          breakdown={data?.distribution}
          className="animate-slide-up"
        />
      </div>
      <ReportsChart />
      <div
        className="animate-slide-up mt-6"
        style={{ animationDelay: "400ms" }}
      >
        <ReportsTable />
      </div>
    </div>
  );
}
