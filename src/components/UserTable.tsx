"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  BadgeCheck,
  BadgeAlert,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  XIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getUsers, removeUnverifiedUsers } from "@/services/api";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useDebounceValue } from "usehooks-ts";

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  avatar: string;
  isMailVerified: boolean;
  loginType: string;
  sessions: number;
}

const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;

const RemoveUnverifiedDialog = () => {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const removeUnverifiedMutation = useMutation({
    mutationFn: removeUnverifiedUsers,
    onSuccess: () => {
      queryClient.setQueryData<User[]>(
        ["getUsers"],
        (old) => old?.filter((user) => user.isMailVerified === true) ?? [],
      );
      queryClient.invalidateQueries({ queryKey: ["getUsers"] });
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
      <AlertDialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => setOpen(true)} variant="destructive">
              <BadgeAlert />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Remove Unverified Users</p>
          </TooltipContent>
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Remove Unverified Users</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to remove all unverified users?
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setOpen(false)}
            disabled={removeUnverifiedMutation.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              className="text-white"
              onClick={() => removeUnverifiedMutation.mutate()}
              disabled={removeUnverifiedMutation.isPending}
            >
              {removeUnverifiedMutation.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Remove"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export function UserTable() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [search] = useDebounceValue(query, 500);
  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["getUsers", page, search.trim()],
    queryFn: () => getUsers(page, search.trim()),
    placeholderData: keepPreviousData,
    staleTime: 15 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const unverifiedUsers = useMemo(() => {
    if (!data?.users?.length) return 0;
    return data.users.filter((user: User) => !user.isMailVerified).length;
  }, [data]);

  const handleLoginToast = () => {
    toast.warning("Please login to continue");
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!!token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <Card className="border-0 shadow-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold">
            User Management
          </CardTitle>
          <div className="flex gap-2">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 bg-secondary border-0"
              />
              {query?.length > 0 && (
                <button
                  className="absolute right-0 p-1 text-muted-foreground rounded top-1/2 -translate-1/2 cursor-default"
                  onClick={() => setQuery("")}
                >
                  <XIcon size="16" />
                </button>
              )}
            </div>
            {isLoggedIn &&
              (unverifiedUsers !== 0 ? (
                <RemoveUnverifiedDialog />
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="destructive" onClick={handleLoginToast}>
                      <BadgeAlert />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove Unverified Users</p>
                  </TooltipContent>
                </Tooltip>
              ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading || isFetching ? (
          <div className="grid place-content-center h-48">
            <Loader2 className="animate-spin" />
          </div>
        ) : data?.users?.length === 0 || isError ? (
          <div className="flex flex-col items-center justify-center gap-2 h-32">
            <AlertTriangle size="40" />
            <p className="text-xl font-semibold tracking-tight">
              {isError
                ? error?.message || "Something went wrong"
                : `No users found`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-semibold">Username</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Verified</TableHead>
                  <TableHead className="font-semibold">Joined</TableHead>
                  <TableHead className="font-semibold">Login</TableHead>
                  <TableHead className="font-semibold">Sessions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.users?.map((user: User, index: number) => (
                  <TableRow
                    className="animate-fade-in hover:bg-muted/50"
                    style={{ animationDelay: `${index * 50}ms` }}
                    key={index}
                  >
                    <TableCell className="font-medium">
                      <Link
                        href={`${baseUrl}/${user.username}`}
                        target="_blank"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-white">
                              {user.username[0]}
                            </AvatarFallback>
                          </Avatar>
                          {user.username}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`mailto:${user.email}`}
                        className="text-blue-500/50 hover:text-blue-500 hover:underline"
                      >
                        {user.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      {user.isMailVerified ? (
                        <Badge variant="secondary" className="bg-green-500/40">
                          <BadgeCheck className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <BadgeAlert />
                          Unverified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(parseISO(user.createdAt), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {user.loginType === "local" ? "email" : user.loginType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.sessions === 0 ? "secondary" : "default"}
                        className="font-medium"
                      >
                        {user.sessions}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      {data?.users?.length > 0 && data?.maxPages > 1 && (
        <CardFooter>
          <Pagination>
            <PaginationContent>
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size="20" />
              </Button>
              {Array.from({ length: Math.ceil(data?.max / data?.limit) }).map(
                (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      className="cursor-default"
                      onClick={() => setPage(index + 1)}
                      isActive={data?.page === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground"
                disabled={page === Math.ceil(data?.max / data?.limit)}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight size="20" />
              </Button>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
  );
}
