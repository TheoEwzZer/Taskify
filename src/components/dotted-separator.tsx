import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { ReactElement, useEffect, useState } from "react";

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
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState<"#303036" | "#d4d4d8" | null>(null);

  useEffect((): void => {
    if (resolvedTheme === "dark") {
      setColor("#303036");
    } else {
      setColor("#d4d4d8");
    }
  }, [resolvedTheme]);

  if (!color) {
    return null;
  }

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
          backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
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
