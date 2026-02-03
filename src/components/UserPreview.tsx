import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/lib/types";
import { Calendar, Image, Mail, Users } from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Button } from "./ui/button";

function UserPreview({ user }: { user: User }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-center gap-4">
        <Avatar className="size-32">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-2xl tracking-tighter font-bold">
              {user?.fullName}
            </h1>
            <p className="text-muted-foreground">@{user?.username}</p>
          </div>
        </div>
      </div>
      <p>{user?.caption}</p>
      <div className="flex items-center gap-4 text-muted-foreground text-sm">
        <div className="flex items-center gap-1">
          <Image size="18" />
          <span>{user?.postsCount} Posts</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size="18" />
          <span>{user?.followersCount} Followers</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size="18" />
          <span>{user?.followingCount} Following</span>
        </div>
      </div>
      <div className="flex items-center text-muted-foreground text-sm gap-1">
        <Mail size="18" />
        <Link
          href={`mailto:${user?.email}`}
          target="_blank"
          className="hover:underline"
        >
          {user?.email}
        </Link>
      </div>
      {user?.createdAt && (
        <div className="flex items-center text-muted-foreground text-sm gap-1">
          <Calendar size="18" />
          <p>{format(parseISO(user?.createdAt), "dd/MM/yyyy")}</p>
        </div>
      )}
      <div className="w-full absolute bottom-0 left-0 p-2">
        <Button className="w-full" asChild>
          <Link
            href={`${process.env.NEXT_PUBLIC_WEB_URL}/${user?.username}`}
            target="_blank"
          >
            View Full Profile
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default UserPreview;
