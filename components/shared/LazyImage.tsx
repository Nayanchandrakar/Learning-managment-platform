"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { FC, useState } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
}

const LazyImage: FC<LazyImageProps> = (
  { src, alt, width, height, sizes, ...props },
  ref
) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="relative inset-0 w-full h-full">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes || ""}
        {...props}
        ref={ref}
      />
      <div
        className={cn(
          "w-full transition-all duration-300 h-full absolute inset-0 ",
          isLoading && "bg-white/10  backdrop-blur-lgs"
        )}
      />
    </div>
  );
};

export default LazyImage;
