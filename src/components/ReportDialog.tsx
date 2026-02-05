"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteReport, getEntity, updateReport } from "@/services/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Report } from "@/lib/types";
import { AlertTriangle, Calendar, Info, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { format, parseISO } from "date-fns";
import PostPreview from "./PostPreview";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { cn, getIcon } from "@/lib/utils";
import CommentPreview from "./CommentPreview";
import ChatPreview from "./ChatPreview";
import UserPreview from "./UserPreview";
import ImagePreview from "./ImagePreview";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

function Entity({
  kind,
  user,
  entity,
}: {
  kind: Report["kind"];
  user: Report["user"];
  entity: any;
}) {
  switch (kind) {
    case "chat":
      return <ChatPreview chat={entity} reporter={user?._id} />;
    case "comment":
      return <CommentPreview comment={entity} />;
    case "confession":
      return <div>Confession</div>;
    case "post":
      return <PostPreview post={entity} />;
    case "problem":
      return <div>Problem</div>;
    case "story":
      return <div>Story</div>;
    case "user":
      return <UserPreview user={entity} />;
    default:
      return null;
  }
}

function ReportDialog({
  open,
  setOpen,
  report,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  report: Report;
}) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [status, setStatus] = useState(report?.status || "pending");
  const { data, isLoading, refetch } = useQuery({
    queryKey: [`entity-${report.entityId}`],
    queryFn: () => getEntity(report.entityId, report.kind),
    gcTime: 15 * 60 * 60,
    enabled: false,
  });

  const queryClient = useQueryClient();

  const updateReportMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Report["status"] }) =>
      updateReport(id, status),
    onSuccess: (data, values) => {
      queryClient.setQueryData<Report[]>(
        ["reportsData"],
        (old) =>
          old?.map((r) => {
            if (r._id === values.id) {
              return { ...r, status: data?.status };
            } else return r;
          }) ?? [],
      );
      setStatus(data?.status);
    },
    onError: (error) => {
      console.log(error);
      let message = "Something went wrong";
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || error?.message;
      } else message = error?.message;
      toast.error(message);
    },
  });

  const deleteReportMutation = useMutation({
    mutationFn: () => deleteReport(report.entityId),
    onSuccess: () => {
      queryClient.setQueryData<Report[]>(
        ["reportsData"],
        (old) => old?.filter((r) => r._id !== report.entityId) ?? [],
      );
      setOpen(false);
    },
    onError: (error) => {
      console.log(error);
      let message = "Something went wrong";
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || error?.message;
      } else message = error?.message;
      toast.error(message);
    },
  });
  const Icon = useMemo(() => getIcon(report?.kind), [report?.kind]);

  useEffect(() => {
    if (!open || report?.kind === "problem") return;
    refetch();
  }, [open]);

  if (!report?.kind) {
    return (
      <Dialog open={open}>
        <DialogContent>
          <div className="flex flex-col items-center justify-center gap-2 py-10">
            <AlertTriangle size="40" />
            <DialogTitle className="text-center">Error</DialogTitle>
            <DialogDescription>{"Something went wrong"}</DialogDescription>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open}>
      <DialogContent
        className={cn("p-0", report?.kind === "problem" ? "" : "sm:max-w-4xl")}
        showCloseButton={false}
      >
        <div className="flex h-full">
          {report?.kind !== "problem" && (
            <div className="flex flex-col flex-1 max-sm:hidden">
              <div className="flex items-center gap-2 h-16 p-4 w-fit">
                <DialogTitle className="whitespace-nowrap">
                  Reported Content
                </DialogTitle>
                <Badge className="capitalize" variant="outline">
                  <Icon />
                  {report.kind}
                </Badge>
              </div>
              <Separator />
              <ScrollArea className="flex-1 p-4 max-h-[80vh]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  <Entity
                    entity={data}
                    kind={report?.kind}
                    user={report.user}
                  />
                )}
              </ScrollArea>
            </div>
          )}
          <div
            className={cn(
              report?.kind === "problem" ? "w-full" : "w-80",
              "flex flex-col justify-between border-l relative max-sm:w-full",
            )}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center h-16 p-4">
                <DialogTitle>Details</DialogTitle>
              </div>
              <Separator />
              <div className="flex flex-col gap-2 p-4">
                <div className="space-y-1">
                  <div className="uppercase text-xs text-muted-foreground">
                    Reason
                  </div>
                  <p className="text-lg">{report?.title}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <div className="uppercase text-xs text-muted-foreground">
                    Description
                  </div>
                  <p>{report?.description}</p>
                </div>
                {report?.images?.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-1">
                      <div className="uppercase text-xs text-muted-foreground">
                        Images
                      </div>
                      <div className="flex items-center gap-2">
                        {report.images.map((item, index) => (
                          <ImagePreview image={item} key={index} />
                        ))}
                      </div>
                    </div>
                  </>
                )}
                <Separator />
                <div className="space-y-2">
                  <div className="text-xs uppercase text-muted-foreground">
                    Reported By
                  </div>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_WEB_URL}/${report?.user?.username}`}
                    target="_blank"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={report?.user?.avatar} />
                        <AvatarFallback>
                          {report?.user?.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="tracking-tight font-semibold leading-3">
                          {report?.user?.fullName}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {report?.user?.username}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
                {report?.createdAt && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="uppercase text-xs text-muted-foreground">
                        Reported on
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar size="18" />
                        {format(parseISO(report?.createdAt), "MMM d, yyyy")}
                        <span> at </span>
                        {format(parseISO(report?.createdAt), "hh:mm aaa")}
                      </div>
                    </div>
                  </>
                )}
                <Separator />
                <div className="space-y-2">
                  <div className="text-xs uppercase text-muted-foreground">
                    Status
                  </div>
                  <Select
                    value={status}
                    onValueChange={(value: Report["status"]) =>
                      updateReportMutation.mutate({
                        id: report._id,
                        status: value,
                      })
                    }
                    disabled={updateReportMutation.isPending || !isLoggedIn}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <div className="size-2 bg-amber-500/60 rounded-full" />
                        Pending
                      </SelectItem>
                      <SelectItem value="resolved">
                        <div className="size-2 bg-green-500/60 rounded-full" />
                        Resolved
                      </SelectItem>
                      <SelectItem value="rejected">
                        <div className="size-2 bg-red-500/60 rounded-full" />
                        Rejected
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-2 sm:hidden">
                      <Separator />
                      <div className="flex items-center justify-center gap-1 sm:hidden text-muted-foreground uppercase text-xs">
                        <Info size="16" />
                        Showing basic report details
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Switch to desktop/laptop to view reported content</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex flex-col gap-2 border-t p-2 w-full">
              <Button
                variant="destructive"
                onClick={() => {
                  toast.warning("Please login to continue");
                  router.push("/login");
                }}
                disabled={deleteReportMutation.isPending || !isLoggedIn}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={deleteReportMutation.isPending}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReportDialog;
