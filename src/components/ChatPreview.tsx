import { Chat, Message, Post } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { format, parseISO } from "date-fns";
import { Inter } from "next/font/google";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { DownloadIcon, FileIcon, Loader2, PlayIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@/services/api";
import { useEffect } from "react";

const inter = Inter({
  weight: "400",
});

const Asset = ({
  content,
  post,
  kind,
}: {
  content: string;
  post?: Post;
  kind?: Message["kind"];
}) => {
  function handleDownload(content: string) {
    const fileURL = content.replace("/upload", "/upload/fl_attachment");
    const a = document.createElement("a");
    a.href = fileURL;
    a.download = `Document-${content}`;
    document.body.append(a);
    a.click();
    document.body.removeChild(a);
  }

  switch (kind) {
    case "post":
      if (!post) {
        return (
          <div className="flex flex-col justify-center text-left p-3">
            <h3 className="font-semibold">Post unavailable</h3>
            <p className="text-stone-500 text-sm">
              This might have been deleted or is no longer available.
            </p>
          </div>
        );
      } else {
        return (
          <div className="flex flex-col gap-1">
            <Link
              href={
                post.kind === "video"
                  ? `${process.env.NEXT_PUBLIC_WEB_URL}/video/${post._id}`
                  : `${process.env.NEXT_PUBLIC_WEB_URL}/post/${post?._id}`
              }
              target="_blank"
              className="rounded-2xl aspect-square py-1 flex flex-col gap-1 relative"
            >
              <div className="flex items-center p-2 pb-0 gap-2">
                <Avatar>
                  <AvatarImage src={post.user.avatar} />
                  <AvatarFallback>{post.user?.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center">
                  <h1 className="font-semibold tracking-tight leading-3">
                    {post?.user?.fullName}
                  </h1>
                  <span className="text-stone-500 text-sm">
                    @{post.user?.username}
                  </span>
                </div>
              </div>
              <Image
                src={
                  post.kind === "image" ? post.media[0] : post.thumbnail || ""
                }
                width="240"
                height="240"
                alt=""
                className={`pointer-events-none aspect-square select-none object-contain ${
                  post.caption ? "" : "rounded-b-xl"
                }`}
              />
              {post.kind === "video" && (
                <div className="bg-transparent/50 text-sm text-white backdrop-blur-sm rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2">
                  <PlayIcon className="size-6 sm:size-8" />
                </div>
              )}
              {post.caption && (
                <span className="px-3 pb-2 pt-1 truncate w-60">
                  {post.caption}
                </span>
              )}
            </Link>
          </div>
        );
      }
    case "location":
      return (
        <Link href={content} target="_blank">
          <Image
            src={`https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=240&height=240&center=lonlat:${content
              .split("?q=")[1]
              .split(",")
              .reverse()
              .join(
                ",",
              )}&zoom=15&scaleFactor=2&marker=lonlat:${content.split("?q=")[1].split(",").reverse().join(",")};color:%23ff0000;size:small&apiKey=${
              process.env.NEXT_PUBLIC_MAPS_API_KEY
            }`}
            alt=""
            className="rounded-xl w-60 aspect-square"
            width="240"
            height="240"
          />
        </Link>
      );
    case "image":
      return (
        <Image
          src={content}
          alt=""
          width="160"
          height="160"
          className="w-full h-full"
        />
      );
    case "video":
      return (
        <video
          src={content}
          width="160"
          height="160"
          controlsList="nodownload"
          className="w-full object-contain rounded-lg"
        />
      );
    case "audio":
      return (
        <div className="py-2">
          <audio src={content} controls />
        </div>
      );
    case "document":
      <div
        className={`flex items-center justify-between gap-4 rounded-full py-2 w-fit`}
      >
        <FileIcon size="40" />
        <p>...{content.slice(content.length - 10, content.length)}</p>
        <Button
          size="icon"
          variant="secondary"
          className="bg-transparent hover:bg-transparent/50 text-white rounded-xl"
          onClick={() => handleDownload(content)}
        >
          <DownloadIcon />
        </Button>
      </div>;
    default:
      if (content?.includes("https://")) {
        const urlIdx = content.indexOf("https://");
        const url = content.slice(urlIdx).split(" ")[0];
        return (
          <>
            {content.slice(0, urlIdx)}
            <Link
              href={url}
              target="_blank"
              className="text-blue-500 hover:underline underline-offset-2"
            >
              {url}
            </Link>
            &nbsp;
            {content.slice(urlIdx).split(" ")[1]}
          </>
        );
      } else return <>{content}</>;
  }
};

function ChatPreview({ chat, reporter }: { chat: Chat; reporter: string }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [`messages-${chat?._id}`],
    queryFn: () => getMessages(chat?._id),
    enabled: false,
  });

  function getUniqueEmojis(reacts: Message["reacts"]): string {
    let threeEmojis = new Set<string>();
    reacts.map((react) => {
      if (threeEmojis.size < 3) {
        threeEmojis.add(react.content);
      }
    });
    return Array.from(threeEmojis).join("");
  }

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="pb-16 relative">
      <ScrollArea className="max-h-[80vh]">
        {isLoading && (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="animate-spin" />
          </div>
        )}
        {data?.map((message: Message, index: number) => (
          <div
            className={cn(
              "flex flex-col justify-center gap-1 mt-2 relative",
              message?.sender?._id === reporter ? "items-end" : "items-start",
              inter.className,
            )}
            key={index}
          >
            {data[index - 1]?.createdAt.slice(0, 10) !==
              message?.createdAt?.slice(0, 10) && (
              <div className="text-xs text-muted-foreground self-center text-center">
                {format(parseISO(message.createdAt), "d MMM, yyyy")}
              </div>
            )}
            {message?.kind === "message" ? (
              <div
                className={cn(
                  "px-3 py-1.5 rounded-xl text-sm",
                  message?.sender?._id === reporter
                    ? "bg-stone-800 text-white"
                    : "bg-stone-200 text-black",
                )}
              >
                {message?.content}
              </div>
            ) : (
              <Asset
                content={message?.content}
                post={message?.post}
                kind={message?.kind}
              />
            )}
            {message?.reacts?.length > 0 && (
              <div
                className={cn(
                  "rounded-xl text-xs p-0.5 -mt-3 border",
                  message?.sender?._id === reporter
                    ? "border-stone-800 bg-background text-white"
                    : "border-stone-200 bg-foreground text-black",
                )}
              >
                {getUniqueEmojis(message?.reacts)}
                {message?.reacts?.length > 1 && (
                  <span className="p-0.5">{message?.reacts?.length}</span>
                )}
              </div>
            )}
            {message?.createdAt && (
              <span
                className={cn(
                  "text-muted-foreground font-light",
                  message?.sender?._id === reporter ? "" : "pl-1",
                )}
                style={{ fontSize: "10px" }}
              >
                {format(parseISO(message?.createdAt), "h:mm aaa")}
              </span>
            )}
          </div>
        ))}
      </ScrollArea>
      <div className="absolute flex flex-col gap-2 pt-2 bottom-0 left-0 bg-background w-full border-t">
        <div className="text-xs uppercase text-muted-foreground">
          Participants:
        </div>
        <div className="flex items-center">
          {chat?.users?.map((user, index) => (
            <Avatar className="-mr-2" key={index}>
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.username[0]}</AvatarFallback>
            </Avatar>
          ))}
          <div className="ml-3">
            {chat?.users?.map((user, index) => (
              <Link
                href={`${process.env.NEXT_PUBLIC_WEB_URL}/${user?.username}`}
                className="text-blue-500/50 hover:text-blue-500"
                target="_blank"
                key={index}
              >
                <span className="hover:underline">{user?.username}</span>
                {index !== chat?.users?.length - 1 && ", "}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPreview;
