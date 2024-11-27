import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon, XIcon } from "lucide-react";
import { ChangeEvent, ReactElement, useState } from "react";
import { useUpdateTask } from "../../api/use-update-task";
import { Task } from "../../types";

interface TaskDescriptionProps {
  task: Task;
}

export const TaskDescription: ({
  task,
}: TaskDescriptionProps) => ReactElement = ({ task }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string | undefined>(task.description);

  const { mutate, isPending } = useUpdateTask();

  const handleSave: () => void = (): void => {
    mutate(
      {
        json: { description: value },
        param: { taskId: task.$id },
      },
      {
        onSuccess: (): void => {
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button
          size="sm"
          variant="secondary"
          onClick={(): void => setIsEditing((prev: boolean): boolean => !prev)}
        >
          {isEditing ? <XIcon /> : <PencilIcon />}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder="Add a description..."
            value={value}
            rows={4}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>): void =>
              setValue(e.target.value)
            }
            disabled={isPending}
          />
          <Button
            size="sm"
            className="ml-auto w-fit"
            onClick={handleSave}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      ) : (
        <div className="whitespace-pre-wrap">
          {task.description ?? (
            <span className="text-muted-foreground">No description set</span>
          )}
        </div>
      )}
    </div>
  );
};
