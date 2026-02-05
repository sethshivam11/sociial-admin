"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthProvider";

const LoginPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const { setIsLoggedIn } = useAuth();

  const loginMutation = useMutation({
    mutationFn: () => login({ username, password }),
    onSuccess: (data) => {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 1);
      localStorage.setItem(
        "token",
        JSON.stringify({ token: data?.token, expiry }),
      );
      setIsLoggedIn(true);
      router.push("/");
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="min-h-dvh bg-linear-0 from-stone-900 to-stone-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-primary">
              <Image
                src="/logo.svg"
                className="select-none"
                width="50"
                height="50"
                alt=""
                draggable={false}
              />
            </div>
          </div>
          <div>
            <CardTitle className="text-xl tracking-tighter">
              Admin Dashboard
            </CardTitle>
            <CardDescription className="mt-1">
              Sign in to access the admin panel
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPwd ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Checkbox
                id="show-pwd"
                checked={showPwd}
                onCheckedChange={(checked) => setShowPwd(!!checked)}
              />
              <Label htmlFor="show-pwd" className="font-light">
                Show Password
              </Label>
            </div>
            <div className="space-y-2">
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full text-blue-800 hover:text-blue-600"
                onClick={() => router.push("/")}
              >
                Continue without Logging In
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
