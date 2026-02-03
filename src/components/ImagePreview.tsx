import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Image from "next/image";

function ImagePreview({ image }: { image: string }) {
  return (
    <Dialog>
      <DialogTrigger className="border border-background hover:border-muted p-1 rounded">
        <Image src={image} alt="" width="50" height="50" />
      </DialogTrigger>
      <DialogContent
        className="p-0 border-none"
        onOpenAutoFocus={(e) => e?.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
        </DialogHeader>
        <Image
          src={image}
          alt=""
          width="1024"
          height="1024"
          className="object-contain max-h-60vh"
        />
      </DialogContent>
    </Dialog>
  );
}

export default ImagePreview;
