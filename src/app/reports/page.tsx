import { ReportsTable } from "@/components/ReportsTable";
import { StatsCard } from "@/components/StatsCard";
import { getReports } from "@/services/api";
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
  const data = await getReports();

  const stats =
    data?.reduce((acc: Record<string, number>, report: Report) => {
      acc[report.kind] = (acc[report.kind] || 0) + 1;
      return acc;
    }, {}) || {};

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Reports"
          value={data?.length || 0}
          icon={Flag}
          className="animate-slide-up"
        />
        <StatsCard
          title="Problems"
          value={stats?.problem || 0}
          icon={OctagonAlert}
          className="animate-slide-up"
          style={{ animationDelay: "300ms" }}
        />
        <StatsCard
          title="Chats"
          value={stats?.chat || 0}
          icon={Mail}
          className="animate-slide-up"
          style={{ animationDelay: "300ms" }}
        />
        <StatsCard
          title="Posts"
          value={stats?.post || 0}
          icon={Image}
          className="animate-slide-up"
          style={{ animationDelay: "100ms" }}
        />
        <StatsCard
          title="Comments"
          value={stats?.comment || 0}
          icon={MessageCircle}
          className="animate-slide-up"
          style={{ animationDelay: "200ms" }}
        />
        <StatsCard
          title="Users"
          value={stats?.user || 0}
          icon={UsersRound}
          className="animate-slide-up"
          style={{ animationDelay: "300ms" }}
        />
        <StatsCard
          title="Stories"
          value={stats?.story || 0}
          icon={CircleDashed}
          className="animate-slide-up"
          style={{ animationDelay: "300ms" }}
        />
        <StatsCard
          title="Confessions"
          value={stats?.confession || 0}
          icon={MessageSquareHeart}
          className="animate-slide-up"
          style={{ animationDelay: "300ms" }}
        />
      </div>

      <div className="animate-slide-up" style={{ animationDelay: "400ms" }}>
        <ReportsTable />
      </div>
    </div>
  );
}
