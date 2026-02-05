import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Calendar,
  Ellipsis,
  Heart,
  History,
  MessageSquareText,
} from "lucide-react";
import {
  Carousel,
  CarouselPrevious,
  CarouselNext,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "./ui/carousel";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

function PostPreview({
  post,
}: {
  post: {
    _id: string;
    user: {
      _id: string;
      username: string;
      fullName: string;
      avatar: string;
    };
    caption: string;
    media: string[];
    thumbnail?: string;
    kind: "image" | "video";
    likes: string[];
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    updatedAt: string;
  };
}) {
  const router = useRouter();

  const [api, setApi] = useState<CarouselApi>();
  const [count, setCount] = useState(1);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (post?.kind === "video") {
    return (
      <div className="flex items-center justify-center overflow-hidden relative">
        <div className="flex flex-col rounded-md">
          <div className="flex items-center gap-2 p-2">
            <Avatar>
              <AvatarImage src={post?.user?.avatar} />
              <AvatarFallback>{post?.user?.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{post?.user?.fullName}</span>
              <span className="text-muted-foreground text-sm leading-3">
                {post?.user?.username}
              </span>
            </div>
          </div>
          <video
            src={post?.media[0]}
            className="max-h-[60vh] object-contain"
            controlsList="nodownload"
            controls
          />
          <div className="flex items-center gap-4 text-muted-foreground text-sm p-3">
            <div className="flex items-center gap-1">
              <Heart size="18" /> {post?.likesCount}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquareText size="18" /> {post?.commentsCount}
            </div>
          </div>
          <div className="">{post?.caption?.slice(0, 30)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl w-full bg-stone-900 p-4">
      <div className="flex items-center gap-2">
        <Link
          className="w-8 h-8"
          href={`${process.env.NEXT_PUBLIC_WEB_URL}/${post?.user?.username}`}
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={post?.user?.avatar} />
            <AvatarFallback>{post?.user?.username[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <Link
          href={`${process.env.NEXT_PUBLIC_WEB_URL}/${post?.user?.username}`}
          target="_blank"
        >
          <p className="flex items-center justify-start gap-0.5">
            <span>{post?.user?.fullName}</span>
          </p>
          <p className="text-sm text-muted-foreground leading-3">
            @{post?.user?.username}
          </p>
        </Link>
      </div>
      <Carousel setApi={setApi} className="w-full relative my-2 mt-2">
        {post?.media?.length > 1 && (
          <div className="w-10 h-7 flex items-center justify-center absolute right-2 top-2 bg-black/60 text-white text-sm font-light rounded-2xl select-none z-10">
            {current}/{count}
          </div>
        )}
        <CarouselContent>
          {post?.media?.map((image, index) => {
            return (
              <CarouselItem key={index} className="relative">
                <Image
                  width="800"
                  height="800"
                  src={post?.kind === "image" ? image : post?.thumbnail || ""}
                  alt={`${post?.kind === "image" ? "Post" : "Video"} by ${
                    post?.user?.fullName
                  } with username ${post?.user?.username}`}
                  className="object-cover select-none w-full h-full rounded-sm z-10 max-h-150"
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-2 dark:bg-black/30 hover:dark:bg-black/50" />
        <CarouselNext className="right-2 dark:bg-black/30 hover:dark:bg-black/50" />
      </Carousel>
      <div className="flex items-center gap-4 text-muted-foreground text-sm">
        <div className="flex items-center gap-1">
          <Heart /> {post?.likesCount}
        </div>
        <div className="flex items-center gap-1">
          <MessageSquareText /> {post?.commentsCount}
        </div>
      </div>
      {post?.caption && (
        <p className="py-1 text-sm">
          <span>{post?.caption?.slice(0, 30)}</span>
        </p>
      )}
      {post?.createdAt && (
        <span className="flex items-center gap-1 text-sm text-stone-500 mt-1 select-none w-full">
          <Calendar size="20" />
          <div className="flex items-center justify-between w-full">
            <span>{format(parseISO(post?.createdAt), "hh:mm")}</span>
            <span>{format(parseISO(post?.createdAt), "dd/MM/yyyy")}</span>
          </div>
        </span>
      )}
    </div>
  );
}

export default PostPreview;
