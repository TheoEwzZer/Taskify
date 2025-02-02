import { cn } from "@/lib/utils";
import { ReactElement } from "react";

interface DottedSeparatorProps {
  className?: string;
  height?: string;
  dotSize?: string;
  gapSize?: string;
  direction?: "horizontal" | "vertical";
}

export const DottedSeparator: ({
  className,
  height,
  dotSize,
  gapSize,
  direction,
}: DottedSeparatorProps) => ReactElement | null = ({
  className = "",
  height = "2px",
  dotSize = "2px",
  gapSize = "6px",
  direction = "horizontal",
}: DottedSeparatorProps) => {
  const isHorizontal: boolean = direction === "horizontal";

  return (
    <div
      className={cn(
        isHorizontal
          ? "flex w-full items-center"
          : "flex h-full flex-col items-center",
        className
      )}
    >
      <div
        className={isHorizontal ? "grow" : "grow-0"}
        style={{
          width: isHorizontal ? "100%" : height,
          height: isHorizontal ? height : "100%",
          backgroundImage:
            "radial-gradient(circle, #303036 25%, transparent 25%)",
          backgroundSize: isHorizontal
            ? `${parseInt(dotSize) + parseInt(gapSize)}px ${height}`
            : `${height} ${parseInt(dotSize) + parseInt(gapSize)}px`,
          backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};
