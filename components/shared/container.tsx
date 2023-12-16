import { cn } from "@/lib/utils";
import { FC } from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: FC<ContainerProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "max-w-[1800px] mx-auto px-4 sm:px-6 md:px-10 lg:px-8 w-full",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
