import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { ReactElement, ReactNode } from "react";
import { useDeleteTask } from "../api/use-delete-task";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: ReactNode;
}

export const TaskActions: ({
  id,
  projectId,
  children,
}: TaskActionsProps) => ReactElement = ({ id, projectId, children }) => {
  const workspaceId: string = useWorkspaceId();
  const router: AppRouterInstance = useRouter();

  const { open } = useEditTaskModal();

  const [ConfimDialog, confirm] = useConfirm(
    "Remove task",
    "This action cannot be undone.",
    "destructive"
  );
  const { mutate, isPending } = useDeleteTask();

  const onDelete: () => Promise<void> = async () => {
    const ok: unknown = await confirm();

    if (!ok) {
      return;
    }

    mutate({ param: { taskId: id } });
  };

  const onOpenTask: () => void = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onOpenProject: () => void = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };

  return (
    <div className="flex justify-end">
      <ConfimDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48"
        >
          <DropdownMenuItem
            onClick={onOpenTask}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <ExternalLinkIcon className="stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <ExternalLinkIcon className="stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(): void => {
              open(id);
            }}
            disabled={false}
            className="p-[10px] font-medium"
          >
            <PencilIcon className="stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="p-[10px] font-medium text-amber-700 focus:text-amber-700"
          >
            <TrashIcon className="stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
