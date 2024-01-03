import { cn } from "@/lib/utils";
import { FC } from "react";
import { Progress } from "../ui/progress";

interface CourseProgressProps {
  size?: "default" | "sm";
  variant: "default" | "success";
  value: number;
}

const colorByVariant = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

const CourseProgress: FC<CourseProgressProps> = ({ value, variant, size }) => {
  return (
    <div>
      <Progress className="h-2" value={value} variant={variant} />
      <p
        className={cn(
          "font-medium mt-2 text-sky-700",
          colorByVariant[variant || "default"],
          sizeByVariant[size || "default"]
        )}
      >
        {Math.round(value)}% Complete
      </p>
    </div>
  );
};

export default CourseProgress;
