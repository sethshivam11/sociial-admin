import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Comment } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { Heart } from "lucide-react";

function CommentPreview({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-2 w-full">
      <Avatar>
        <AvatarImage src={comment?.user?.avatar} draggable={false} />
        <AvatarFallback>{comment?.user?.username[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-1">
          <span className="text-sm">{comment?.user?.username}</span>
          {comment?.createdAt && (
            <div className="flex justify-between items-center text-muted-foreground text-xs w-full">
              <span>· {format(parseISO(comment?.createdAt), "hh:mm")}</span>
              <span>{format(parseISO(comment?.createdAt), "dd/MM/yyyy")}</span>
            </div>
          )}
        </div>
        <p>{comment?.content}</p>
        <div className="flex items-center text-muted-foreground text-sm gap-1">
          <Heart size="18" /> {comment?.likesCount} like
          {comment?.likesCount > 1 && "s"}
        </div>
      </div>
    </div>
  );
}

export default CommentPreview;
