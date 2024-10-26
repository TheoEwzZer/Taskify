import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";
import { ReactElement } from "react";

interface TaskDateProps {
  value: string;
  className?: string;
}

export const TaskDate: ({
  value,
  className,
}: TaskDateProps) => ReactElement = ({ value, className }) => {
  const today = new Date();
  const endDate = new Date(value);
  const diffInDays: number = differenceInDays(endDate, today);

  let textColor: string = "text-muted-foreground";
  if (diffInDays <= 3) {
    textColor = "text-red-500";
  } else if (diffInDays <= 7) {
    textColor = "text-orange-500";
  } else if (diffInDays <= 14) {
    textColor = "text-yellow-500";
  }

  return (
    <div className={textColor}>
      <span className={cn("truncate", className)}>
        {format(endDate, "PPP")}
      </span>
    </div>
  );
};
