import { DatePicker } from "@/components/date-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { ChangeEvent, ReactElement, useState } from "react";
import { DateItem } from "../types";

interface ProjectDatesProps {
  dates: DateItem[] | undefined;
  onChange: (dates: DateItem[] | undefined) => void;
}

export function ProjectDatesComp({
  dates = [],
  onChange,
}: Readonly<ProjectDatesProps>): ReactElement {
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState<Date | undefined>();

  const addDate: () => void = (): void => {
    if (
      newTitle &&
      newDate &&
      !dates?.some((d: DateItem): boolean => d.title === newTitle)
    ) {
      onChange([...(dates || []), { date: newDate, title: newTitle }]);
      setNewTitle("");
      setNewDate(undefined);
    }
  };

  const removeDate: (dateToRemove: DateItem) => void = (dateToRemove) => {
    onChange(
      dates?.filter(
        (d: DateItem): boolean =>
          d.title !== dateToRemove.title || d.date !== dateToRemove.date
      )
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {dates?.map(
          (date: DateItem): ReactElement => (
            <Badge
              key={`${date.title}-${date.date.toISOString()}`}
              variant="secondary"
            >
              {date.title} - {date.date.toLocaleDateString()}
              <Button
                size="sm"
                variant="ghost"
                className="ml-1 h-auto p-0"
                onClick={(): void => removeDate(date)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )
        )}
      </div>
      <div className="flex gap-2">
        <DatePicker
          value={newDate}
          onChange={(date: Date | undefined): void => {
            if (date) {
              setNewDate(date);
            } else {
              setNewDate(new Date());
            }
          }}
          placeholder="Select a date"
          className="w-fit"
        />
        <Input
          value={newTitle}
          onChange={(e: ChangeEvent<HTMLInputElement>): void =>
            setNewTitle(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
            if (e.key === "Enter") {
              e.preventDefault();
              addDate();
            }
          }}
          placeholder="Add a title"
        />
        <Button
          onClick={addDate}
          type="button"
          className="h-auto"
        >
          Add
        </Button>
      </div>
    </div>
  );
}
