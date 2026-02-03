import { clsx, type ClassValue } from "clsx";
import {
  Image,
  MessageCircle,
  MessageSquareHeart,
  OctagonAlert,
  UserRound,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getIcon = (
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
      return Image;
    case "comment":
      return MessageCircle;
    case "user":
      return UserRound;
    case "chat":
      return MessageCircle;
    case "story":
      return Image;
    case "confession":
      return MessageSquareHeart;
    default:
      return OctagonAlert;
  }
};
