import { DottedSeparator } from "@/components/dotted-separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { Member } from "@/features/members/types";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { PencilIcon } from "lucide-react";
import { CSSProperties, ReactElement } from "react";
import { useEditTaskModal } from "../../hooks/use-edit-task-modal";
import { Task } from "../../types";
import { TaskDate } from "../task-date";
import { OverviewProperty } from "./overview-property";

interface TaskOverviewProps {
  task: Task;
}

export const TaskOverview: ({ task }: TaskOverviewProps) => ReactElement = ({
  task,
}) => {
  const { open } = useEditTaskModal();
  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button
            size="sm"
            variant="secondary"
            onClick={(): Promise<URLSearchParams> => open(task.$id)}
          >
            <PencilIcon />
            Edit
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          {task.assignees && task.assignees.length > 0 && (
            <OverviewProperty label="Assignees">
              <div className="flex items-center">
                {task.assignees.map(
                  (assignee: Member, index: number): ReactElement => (
                    <div
                      key={assignee.$id}
                      className="relative z-(--index) hover:z-1000"
                      style={
                        {
                          marginLeft: index !== 0 ? "-5px" : "0",
                          "--index": task.assignees.length - index,
                        } as CSSProperties
                      }
                    >
                      <MemberAvatar
                        member={assignee}
                        className="mt-0 size-8"
                        fallbackClassName="text-[10px]"
                      />
                    </div>
                  )
                )}
              </div>
            </OverviewProperty>
          )}
          <OverviewProperty label="Due Date">
            {task.dueDate ? (
              <TaskDate
                value={task.dueDate}
                className="text-sm font-medium"
              />
            ) : (
              <span className="text-muted-foreground">No due date</span>
            )}
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
