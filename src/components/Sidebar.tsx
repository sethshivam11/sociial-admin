"use client";

import {
  LayoutDashboard,
  Users,
  Flag,
  BarChart3,
  Menu,
  X,
  LogOut,
  LogIn,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lobster_Two } from "next/font/google";
import { useMutation, useQuery } from "@tanstack/react-query";
import { logout } from "@/services/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useAuth } from "@/context/AuthProvider";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Reports", href: "/reports", icon: Flag },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

const lobster = Lobster_Two({
  subsets: ["latin"],
  weight: "700",
  style: ["italic"],
});

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const logOutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    },
    onError: (error) => {
      console.log(error);
      let message = "Something went wrong";
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || error.message;
      } else message = error?.message;
      toast.error(message);
    },
  });

  return (
    <header className={`${pathname.includes("/login") ? "hidden" : ""}`}>
      <div className="flex items-center justify-between max-lg:bg-background/50 max-lg:fixed max-lg:w-full max-lg:backdrop-blur-sm max-lg:p-2 z-40">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <div className="flex items-center gap-1">
          <Image src="/logo.svg" alt="" width="30" height="30" />
          <span className={`text-xl ${lobster.className}`}>Sociial</span>
        </div>
        <div />
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-background/10 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-dvh w-64 bg-stone-900 text-white border-r border-stone-800 transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full gap-4 flex-col">
          <div className="text-4xl tracking-tighter font-extrabold flex items-center p-6 max-lg:justify-center gap-2 w-full">
            <Image
              src="/logo.svg"
              alt=""
              width="50"
              height="50"
              className="pointer-events-none select-none"
              priority={true}
            />
            <span className={`lg:inline hidden ${lobster.className}`}>
              Sociial
            </span>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-secondary"
                      : "text-muted-foreground hover:bg-muted-foreground/30 hover:text-primary/70",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="px-3 py-4">
            {isLoggedIn ? (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => logOutMutation.mutate()}
                disabled={logOutMutation.isPending}
              >
                {logOutMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <LogOut />
                )}
                Log Out
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setIsOpen(false);
                  router.push("/login");
                }}
              >
                <LogIn /> Log In
              </Button>
            )}
          </div>
        </div>
      </aside>
    </header>
  );
}
