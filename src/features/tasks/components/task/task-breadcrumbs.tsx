import { Project } from "@/features/projects/types";
import { ReactElement } from "react";
import { Task } from "../../types";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button"; // Importation du composant Button
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useConfirm } from "@/hooks/use-confirm";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeleteTask } from "../../api/use-delete-task";

interface TaskBreadcrumbsProps {
  project: Project;
  task: Task;
}

export const TaskBreadcrumbs: ({
  project,
  task,
}: TaskBreadcrumbsProps) => ReactElement = ({
  project,
  task,
}: TaskBreadcrumbsProps) => {
  const router: AppRouterInstance = useRouter();
  const [ConfimDialog, confirm] = useConfirm(
    "Delete task",
    "This action cannot be undone.",
    "destructive"
  );

  const { mutate, isPending } = useDeleteTask();

  const handleDeleteTask: () => Promise<void> = async () => {
    const ok: unknown = await confirm();

    if (!ok) {
      return;
    }

    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: (): void => {
          router.push(
            `/workspaces/${project.workspaceId}/projects/${project.$id}`
          );
        },
      }
    );
  };
  return (
    <div className="flex items-center justify-between">
      <ConfimDialog />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <ProjectAvatar
              image={project.image}
              name={project.name}
              className="size-6 lg:size-8"
            />
            <BreadcrumbLink asChild>
              <Link
                href={`/workspaces/${project.workspaceId}/projects/${project.$id}`}
              >
                {project.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRightIcon className="size-4 text-muted-foreground lg:size-5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{task.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Button
        variant="destructive"
        className="ml-auto"
        size="sm"
        onClick={handleDeleteTask}
        disabled={isPending}
      >
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete</span>
      </Button>
    </div>
  );
};
