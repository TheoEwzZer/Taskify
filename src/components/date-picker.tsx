"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  showBadge?: boolean;
}

export const DatePicker: ({
  value,
  onChange,
  className,
  placeholder,
  showBadge,
}: DatePickerProps) => React.ReactElement = ({
  value,
  onChange,
  className,
  placeholder = "Select date",
  showBadge = false,
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={showBadge ? "sm" : "lg"}
          className={cn(
            "w-full justify-start px-3 text-left font-normal",
            !value && "text-muted-foreground",
            showBadge && "h-8 border-dashed",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {!value && placeholder}
          {value && showBadge && (
            <>
              <Separator
                orientation="vertical"
                className="mx-2 h-4"
              />
              <div className="flex space-x-1">
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {format(value, "PPP")}
                </Badge>
              </div>
            </>
          )}
          {value && !showBadge && format(value, "PPP")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          weekStartsOn={1}
          selected={value}
          onSelect={(date: Date | undefined): void => {
            onChange(date as Date);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
