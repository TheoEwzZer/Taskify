import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ReactElement } from "react";

interface CustomToolbarProps {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}

export const CustomToolbar: ({
  date,
  onNavigate,
}: CustomToolbarProps) => ReactElement = ({ date, onNavigate }) => (
  <div className="mb-4 flex w-full items-center justify-center gap-x-2 lg:w-auto lg:justify-start">
    <Button
      onClick={(): void => onNavigate("PREV")}
      variant="secondary"
      size="icon"
    >
      <ChevronLeftIcon className="size-4" />
    </Button>
    <div className="flex h-8 w-full items-center justify-center rounded-md border border-input px-3 py-2 lg:w-auto">
      <CalendarIcon className="mr-2 size-4" />
      <p className="text-sm">{format(date, "MMMM yyyy")}</p>
    </div>
    <Button
      onClick={(): void => onNavigate("NEXT")}
      variant="secondary"
      size="icon"
    >
      <ChevronRightIcon className="size-4" />
    </Button>
  </div>
);
