"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Report } from "@/lib/types";
import { getEntity, getReports } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { use, useEffect, useMemo } from "react";

function Entity({ id, kind }: { id: string; kind: string }) {
  const { data, error, isError } = useQuery({
    queryKey: [`entity-${id}/${kind}`],
    queryFn: () => getEntity(id, kind),
    gcTime: 15 * 60 * 1000,
  });

  if (!id || !kind) {
    return (
      <div className="flex flex-col items-center justify-center h-68">
        <AlertTriangle size="40" />
        <p className="text-xl font-semibold tracking-tight">
          {error?.message || "Something went wrong"}
        </p>
      </div>
    );
  }
  return <div>{JSON.stringify(data)}</div>;
}

function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
    gcTime: 15 * 60 * 1000,
  });

  const report = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return;
    }
    return data.find((item: Report) => item._id === id);
  }, [data]);

  return (
    <div className="px-4 py-6 lg:px-8 lg:py-8 lg:pl-68">
      <div className="mb-8 pt-12 lg:pt-0">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
              {report?.title}
            </h1>
            <p className="mt-1 text-muted-foreground">{report?.description}</p>
          </>
        )}
      </div>
      <Badge className="capitalize">{report?.kind}</Badge>
      {report?.entityId && report?.kind && (
        <Entity id={report?.entityId} kind={report?.kind} />
      )}
    </div>
  );
}

export default page;
