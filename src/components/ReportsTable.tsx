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
} from "lucide-react";
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
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface Report {
  _id: string;
  entityId: string;
  user: {
    _id: string;
    avatar: string;
    username: string;
    fullName: string;
    email: string;
  };
  title: string;
  description: string;
  kind:
    | "post"
    | "comment"
    | "user"
    | "chat"
    | "problem"
    | "story"
    | "confession";
  images: string[];
  createdAt: string;
}

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
    mutationFn: (id: string) => deleteReport(id),
    onSuccess: (data, deletedId) => {
      if (data?.success) {
        queryClient.setQueryData<Report[]>(
          ["reportsData"],
          (old) => old?.filter((r) => r._id !== deletedId) ?? [],
        );
      }
    },
    onError: (error) => {
      console.log(error);
      let message = "Something went wrong";
      if (error instanceof AxiosError) {
        message = error.response?.data?.message;
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-white">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export function ReportsTable() {
  const [deleteDialog, setDeleteDialog] = useState({ id: "", open: false });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reportsData"],
    queryFn: getReports,
    gcTime: 15 * 60 * 1000,
  });

  const getIcon = (
    kind:
      | "post"
      | "comment"
      | "user"
      | "chat"
      | "problem"
      | "story"
      | "confession",
  ) => {
    switch (kind) {
      case "post":
        return ImageIcon;
      case "comment":
        return MessageCircle;
      case "user":
        return UserRound;
      case "chat":
        return MessageCircle;
      case "story":
        return ImageIcon;
      case "confession":
        return MessageSquareHeart;
      default:
        return OctagonAlert;
    }
  };

  return (
    <>
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid place-content-center h-48">
              <Loader2 className="animate-spin" />
            </div>
          ) : !data || data?.length === 0 || isError ? (
            <div className="flex flex-col items-center justify-center gap-2 h-32">
              <AlertTriangle size="40" />
              <p className="text-xl font-semibold tracking-tight">
                {isError
                  ? error?.message || "Something went wrong"
                  : "No users found"}
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
                      Description
                    </TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.map((report: Report, index: number) => {
                    const TypeIcon = getIcon(report.kind);
                    return (
                      <TableRow
                        key={report._id}
                        className="animate-fade-in hover:bg-muted/50"
                        style={{ animationDelay: `${index * 50}ms` }}
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
                          >
                            <Avatar>
                              <AvatarImage
                                src={
                                  report.user.avatar === "/sociial-avatar.svg"
                                    ? `${process.env.NEXT_PUBLIC_WEB_URL}/${report.user.avatar}`
                                    : report.user.avatar
                                }
                              />
                              <AvatarFallback>
                                {report.user.username[0]}
                              </AvatarFallback>
                            </Avatar>
                            {report.user.username}
                          </Link>
                        </TableCell>
                        <TableCell className="max-w-20 truncate">
                          {report.title}
                        </TableCell>
                        <TableCell className="max-w-32 truncate text-muted-foreground">
                          {report.description}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(parseISO(report.createdAt), "MM/dd/yyyy")}
                        </TableCell>
                        <TableCell>
                          <ButtonGroup>
                            <Button variant="outline">
                              <Eye />
                            </Button>
                            <Button className="group" variant="outline">
                              <Trash2 className="group-hover:text-destructive" />
                            </Button>
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
    </>
  );
}
