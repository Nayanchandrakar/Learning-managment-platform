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
  className?: string;
}

const LazyImage: FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  sizes,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative inset-0 w-full h-full">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes || ""}
        className={className}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
      />
      <div
        className={cn(
          "w-full transition-all duration-300 h-full absolute inset-0 bg-black/10 rounded-lg",
          isLoading && "b  backdrop-blur-lg"
        )}
      />
    </div>
  );
};

export default LazyImage;
