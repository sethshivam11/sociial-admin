"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ImageIcon,
  MessageCircle,
  AlertTriangle,
  OctagonAlert,
  UserRound,
  MessageSquareHeart,
  Loader2,
  Trash2,
  Eye,
  ChevronDownIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { deleteReport, getReports } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "./ui/alert-dialog";
import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Report } from "@/lib/types";
import ReportDialog from "./ReportDialog";
import { cn, getIcon } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

const DeleteDialog = ({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string;
}) => {
  const queryClient = useQueryClient();

  const deleteReportMutation = useMutation({
    mutationFn: () => deleteReport(id),
    onSuccess: () => {
      queryClient.setQueryData<Report[]>(
        ["reportsData"],
        (old) => old?.filter((r) => r._id !== id) ?? [],
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

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogTitle>Delete Report</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this report? This action cannot be
          undone.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setOpen(false)}
            disabled={deleteReportMutation.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90 text-white"
            onClick={() => deleteReportMutation.mutate()}
            disabled={deleteReportMutation.isPending}
          >
            {deleteReportMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const initialState: { report: Report; open: boolean } = {
  open: false,
  report: {
    _id: "",
    entityId: "",
    title: "",
    description: "",
    images: [],
    user: {
      _id: "",
      email: "",
      avatar: "",
      username: "",
      fullName: "",
    },
    status: "pending",
    createdAt: "",
    kind: "problem",
  },
};

export function ReportsTable() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [deleteDialog, setDeleteDialog] = useState({ id: "", open: false });
  const [viewDialog, setViewDialog] = useState(initialState);
  const [filter, setFilter] = useState<Report["status"] | "all">("all");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reportsData"],
    queryFn: getReports,
    gcTime: 15 * 60 * 1000,
  });

  const filteredReports = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    if (filter === "all") return data;
    return data.filter((report: Report) => report.status === filter);
  }, [data, filter]);

  return (
    <>
      <Card className="border-0 shadow-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Reports</CardTitle>
            <div className="flex items-center gap-2">
              <Label>Status:</Label>
              <Select
                onValueChange={(value: Report["status"] | "all") =>
                  setFilter(value)
                }
                defaultValue="all"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid place-content-center h-48">
              <Loader2 className="animate-spin" />
            </div>
          ) : !filteredReports || filteredReports?.length === 0 || isError ? (
            <div className="flex flex-col items-center justify-center gap-2 h-32">
              <AlertTriangle size="40" />
              <p className="text-xl font-semibold tracking-tight">
                {isError
                  ? error?.message || "Something went wrong"
                  : "No reports found"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Reporter</TableHead>
                    <TableHead className="font-semibold">Reason</TableHead>
                    <TableHead className="font-semibold text-center">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports?.map((report: Report, index: number) => {
                    const TypeIcon = getIcon(report.kind);
                    return (
                      <TableRow
                        className="animate-fade-in hover:bg-muted/50"
                        style={{ animationDelay: `${index * 50}ms` }}
                        key={index}
                      >
                        <TableCell>
                          <Badge variant="outline" className="capitalize gap-1">
                            <TypeIcon className="h-3 w-3" />
                            {report.kind}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium max-w-50 truncate">
                          <Link
                            className="text-blue-500/50 hover:text-blue-500 hover:underline flex items-center gap-1"
                            href={`${process.env.NEXT_PUBLIC_WEB_URL}/${report.user.username}`}
                            target="_blank"
                          >
                            <Avatar>
                              <AvatarImage src={report.user.avatar} />
                              <AvatarFallback className="text-white">
                                {report.user.username[0]}
                              </AvatarFallback>
                            </Avatar>
                            {report.user.username}
                          </Link>
                        </TableCell>
                        <TableCell className="max-w-20 truncate">
                          {report.title}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={cn(
                              "capitalize",
                              report?.status === "pending"
                                ? "bg-amber-500/60"
                                : report.status === "rejected"
                                  ? "bg-red-500/60"
                                  : "bg-green-500/60",
                            )}
                          >
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(parseISO(report.createdAt), "d/M/yyyy")}
                        </TableCell>
                        <TableCell>
                          <ButtonGroup>
                            <Button
                              variant="outline"
                              className="group"
                              onClick={() =>
                                setViewDialog({
                                  open: true,
                                  report: report,
                                })
                              }
                            >
                              <Eye className="group-hover:text-blue-400" />
                            </Button>
                            {isLoggedIn ? (
                              <Button
                                className="group"
                                variant="outline"
                                onClick={() =>
                                  setDeleteDialog({
                                    open: true,
                                    id: report._id,
                                  })
                                }
                              >
                                <Trash2 className="group-hover:text-destructive" />
                              </Button>
                            ) : (
                              <Button
                                className="group"
                                variant="outline"
                                onClick={() => {
                                  toast.warning("Please login to continue");
                                  router.push("/login");
                                }}
                              >
                                <Trash2 className="group-hover:text-destructive" />
                              </Button>
                            )}
                          </ButtonGroup>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <DeleteDialog
        id={deleteDialog.id}
        open={deleteDialog.open}
        setOpen={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
      />
      <ReportDialog
        open={viewDialog.open}
        setOpen={(open) => setViewDialog((prev) => ({ ...prev, open }))}
        report={viewDialog.report}
      />
    </>
  );
}
