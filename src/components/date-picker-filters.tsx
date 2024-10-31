"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface DatePickerFiltersProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

export const DatePickerFilters: ({
  value,
  onChange,
  placeholder,
}: DatePickerFiltersProps) => React.ReactElement = ({
  value,
  onChange,
  placeholder = "Select date",
}: DatePickerFiltersProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed"
        >
          <CalendarIcon className="h-4 w-4" />
          {placeholder}
          {value && (
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
