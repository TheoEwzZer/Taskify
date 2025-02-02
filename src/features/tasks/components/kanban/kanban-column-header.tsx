import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { snakeCaseToTitleCase } from "@/lib/utils";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";
import { ReactElement, ReactNode } from "react";
import { useCreateTaskModal } from "../../hooks/use-create-task-modal";
import { TaskStatus } from "../../types";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

export const statusIconMap: Record<TaskStatus, ReactNode> = {
  [TaskStatus.BACKLOG]: (
    <CircleDashedIcon className="size-[18px] text-pink-400" />
  ),
  [TaskStatus.TODO]: <CircleIcon className="size-[18px] text-red-400" />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-[18px] text-yellow-400" />
  ),
  [TaskStatus.IN_REVIEW]: (
    <CircleDotIcon className="size-[18px] text-blue-400" />
  ),
  [TaskStatus.DONE]: (
    <CircleCheckIcon className="size-[18px] text-emerald-400" />
  ),
};

export const KanbanColumnHeader: ({
  board,
  taskCount,
}: KanbanColumnHeaderProps) => ReactElement = ({ board, taskCount }) => {
  const { open } = useCreateTaskModal();

  const icon: ReactNode = statusIconMap[board];

  return (
    <div className="flex items-center justify-between px-2 py-1.5">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <Badge
          variant="secondary"
          className="neutral-900 hover:bg-neutral-900"
        >
          {taskCount}
        </Badge>
      </div>
      <Button
        onClick={(): Promise<URLSearchParams> => open(board)}
        size="icon"
        variant="ghost"
        className="size-5"
      >
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
};
