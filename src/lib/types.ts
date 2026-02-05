import { LucideIcon } from "lucide-react";

export interface StatsCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  value: number;
  breakdown?: { [key: string]: number };
  trend?: number;
  className?: string;
  iconClassName?: string;
  style?: React.CSSProperties;
}

export interface Report {
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
  status: "pending" | "resolved" | "rejected";
  images: string[];
  createdAt: string;
}

export interface BasicUser {
  _id: string;
  avatar: string;
  fullName: string;
  username: string;
  email: string;
}

export interface Post {
  _id: string;
  user: BasicUser;
  caption: string;
  media: string[];
  thumbnail?: string;
  kind: "image" | "video";
  likes: string[];
  likesPreview?: BasicUser[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  user: BasicUser;
  post: string;
  content: string;
  likes: string[];
  likesCount: number;
  createdAt: string;
}

export interface Chat {
  _id: string;
  users: BasicUser[];
}

export interface Message {
  _id: string;
  sender: {
    _id: string;
    avatar: string;
    fullName: string;
    username: string;
  };
  chat: string;
  content: string;
  kind:
    | "message"
    | "location"
    | "image"
    | "video"
    | "audio"
    | "document"
    | "post";
  post?: Post;
  reacts:
    | [
        {
          content: string;
          user: string;
          _id: string;
        },
      ]
    | [];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  avatar: string;
  username: string;
  fullName: string;
  email: string;
  caption: string;
  isMailVerified: boolean;
  createdAt: string;
  loginType: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}
