import { DottedSeparator } from "@/components/dotted-separator";
import {
  MemberAvatar,
  MemberAvatarOther,
} from "@/features/members/components/members-avatar";
import { Member } from "@/features/members/types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { MoreHorizontal } from "lucide-react";
import { CSSProperties, ReactElement } from "react";
import { Task } from "../../types";
import { TaskActions } from "../task-actions";
import { TaskDate } from "../task-date";

interface KanbanCardProps {
  task: Task;
}

export const KanbanCard: ({ task }: KanbanCardProps) => ReactElement = ({
  task,
}) => {
  return (
    <div className="mb-1.5 space-y-3 rounded bg-background p-2.5 shadow-xs">
      <div className="flex items-start justify-between gap-x-2">
        <p className="line-clamp-2 text-sm">{task.name}</p>
        <TaskActions
          id={task.$id}
          projectId={task.projectId}
        >
          <MoreHorizontal className="size-[18px] shrink-0 stroke-1 text-neutral-700 transition hover:opacity-75" />
        </TaskActions>
      </div>
      <DottedSeparator />
      <div className="flex items-center gap-x-1.5">
        {task.assignees?.length > 0 && (
          <>
            <div className="flex items-center">
              {task.assignees.slice(0, 2).map(
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
                      className="size-6"
                      fallbackClassName="text-[10px]"
                    />
                  </div>
                )
              )}
              {task.assignees.length > 2 && (
                <div className="relative z-0 ml-[-5] hover:z-1000">
                  <MemberAvatarOther
                    members={task.assignees}
                    maxMembers={2}
                    className="mt-0 size-6"
                    fallbackClassName="text-[10px]"
                  />
                </div>
              )}
            </div>
            <div className="size-1 rounded-full bg-neutral-300" />
          </>
        )}
        <TaskDate
          value={task.dueDate}
          className="text-xs"
        />
      </div>
      <div className="flex items-center gap-x-1.5">
        {task.project && (
          <>
            <ProjectAvatar
              name={task.project.name}
              image={task.project.imageUrl}
              fallbackClassName="text-[10px]"
            />
            <span className="text-xs font-medium">{task.project.name}</span>
          </>
        )}
      </div>
    </div>
  );
};
