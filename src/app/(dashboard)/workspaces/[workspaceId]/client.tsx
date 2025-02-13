"use client";

import { Analytics } from "@/components/analytics";
import { DottedSeparator } from "@/components/dotted-separator";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-member";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { Member } from "@/features/members/types";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { Project } from "@/features/projects/types";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { Task } from "@/features/tasks/types";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { ReactElement } from "react";

export const WorkspaceIdClient: () => ReactElement = () => {
  const workspaceId: string = useWorkspaceId();

  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({
      workspaceId,
    });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading: boolean =
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!analytics || !tasks || !projects || !members) {
    return <PageError message="Failed to fetch workspace data" />;
  }

  return (
    <div className="flex h-full flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TaskList
          data={tasks.documents}
          total={tasks.total}
        />
        <ProjectList
          data={projects.documents}
          total={projects.total}
        />
        <MemberList
          data={members.documents}
          total={members.total}
        />
      </div>
    </div>
  );
};

interface TaskListProps {
  data: Task[];
  total: number;
}

export const TaskList: ({ data, total }: TaskListProps) => ReactElement = ({
  data,
  total,
}) => {
  const workspaceId: string = useWorkspaceId();
  const { open: createTask } = useCreateTaskModal();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total})</p>
          <Button
            variant="muted"
            size="icon"
            onClick={(): Promise<URLSearchParams> => createTask()}
          >
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.slice(0, 10).map(
            (task: Task): ReactElement => (
              <li key={task.$id}>
                <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                  <Card className="rounded-lg shadow-none transition hover:opacity-75">
                    <CardContent className="p-4">
                      <p className="line-clamp-6 text-lg font-medium">
                        {task.name}
                      </p>
                      <div className="flex items-center gap-x-2">
                        <p>{task.project?.name}</p>
                        <div className="size-1 rounded-full bg-neutral-300" />
                        <div className="text-muted-foreground flex items-center text-sm">
                          <CalendarIcon className="mr-1 size-3" />
                          <span className="line-clamp-6">
                            {task.dueDate
                              ? formatDistanceToNow(new Date(task.dueDate))
                              : "No due date"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            )
          )}
          <li className="text-muted-foreground hidden text-center text-sm first-of-type:block">
            No tasks found
          </li>
        </ul>
        <Button
          variant="muted"
          className="mt-4 w-full"
          asChild
        >
          <Link href={`/workspaces/${workspaceId}/tasks`}>View all tasks</Link>
        </Button>
      </div>
    </div>
  );
};

interface ProjectListProps {
  data: Project[];
  total: number;
}

export const ProjectList: ({
  data,
  total,
}: ProjectListProps) => ReactElement = ({ data, total }) => {
  const workspaceId: string = useWorkspaceId();
  const { open: createProject } = useCreateProjectModal();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="bg-background rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button
            variant="secondary"
            size="icon"
            onClick={createProject}
          >
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.map(
            (project: Project): ReactElement => (
              <li key={project.$id}>
                <Link
                  href={`/workspaces/${workspaceId}/projects/${project.$id}`}
                >
                  <Card className="rounded-lg shadow-none transition hover:opacity-75">
                    <CardContent className="flex items-center gap-x-2.5 p-4">
                      <ProjectAvatar
                        className="size-12"
                        fallbackClassName="text-lg"
                        name={project.name}
                      />
                      <p className="truncate text-lg font-medium">
                        {project.name}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            )
          )}
          <li className="text-muted-foreground hidden text-center text-sm first-of-type:block">
            No projects found
          </li>
        </ul>
      </div>
    </div>
  );
};

interface MemberListProps {
  data: Member[];
  total: number;
}

export const MemberList: ({ data, total }: MemberListProps) => ReactElement = ({
  data,
  total,
}) => {
  const workspaceId: string = useWorkspaceId();

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="bg-background rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button
            variant="secondary"
            size="icon"
            asChild
          >
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.map(
            (member: Member): ReactElement => (
              <li key={member.$id}>
                <Card className="overflow-hidden rounded-lg shadow-none">
                  <CardContent className="flex flex-col items-center gap-x-2 p-3">
                    <MemberAvatar
                      className="size-12"
                      fallbackClassName="text-lg"
                      member={member}
                    />
                    <div className="flex flex-col items-center overflow-hidden">
                      <p className="line-clamp-1 text-lg font-medium">
                        {member.name}
                      </p>
                      <p className="text-muted-foreground line-clamp-1 text-sm">
                        {member.email}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </li>
            )
          )}
          <li className="text-muted-foreground hidden text-center text-sm first-of-type:block">
            No members found
          </li>
        </ul>
      </div>
    </div>
  );
};
