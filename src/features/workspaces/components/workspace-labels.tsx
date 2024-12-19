import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { ChangeEvent, ReactElement, useState } from "react";

interface WorkspaceLabelsProps {
  labels: string[];
  onChange: (labels: string[]) => void;
}

export function WorkspaceLabels({
  labels,
  onChange,
}: Readonly<WorkspaceLabelsProps>): ReactElement {
  const [newLabel, setNewLabel] = useState("");

  const addLabel: () => void = (): void => {
    if (newLabel && !labels.includes(newLabel)) {
      onChange([...labels, newLabel]);
      setNewLabel("");
    }
  };

  const removeLabel = (labelToRemove: string): void => {
    onChange(
      labels.filter((label: string): boolean => label !== labelToRemove)
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {labels.map(
          (label: string): ReactElement => (
            <Badge
              key={label}
              variant="secondary"
            >
              {label}
              <Button
                size="sm"
                variant="ghost"
                className="ml-1 h-auto p-0"
                onClick={(): void => removeLabel(label)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )
        )}
      </div>
      <div className="flex gap-2">
        <Input
          value={newLabel}
          onChange={(e: ChangeEvent<HTMLInputElement>): void =>
            setNewLabel(e.target.value)
          }
          placeholder="Add new label"
        />
        <Button
          onClick={addLabel}
          type="button"
          className="h-auto"
        >
          Add
        </Button>
      </div>
    </div>
  );
}
