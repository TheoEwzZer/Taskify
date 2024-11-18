"use client";

import { Analytics } from "@/components/analytics";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { useGetMembers } from "@/features/members/api/use-get-member";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { Member } from "@/features/members/types";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { format } from "date-fns";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { ReactElement } from "react";

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) {
    return "Date not set";
  }
  const date = new Date(dateString);
  return format(date, "PPP");
};

export const ProjectIdClient: () => ReactElement = () => {
  const projectId: string = useProjectId();
  const { data: project, isLoading: isLoadingProject } = useGetProject({
    projectId,
  });
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetProjectAnalytics({ projectId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId: project?.workspaceId ?? "",
  });

  const isLoading: boolean =
    isLoadingProject || isLoadingMembers || isLoadingAnalytics;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!project) {
    return <PageError message="Failed to fetch project" />;
  }

  const assignees: Member[] | undefined = members?.documents.filter(
    (member: Member): boolean => {
      return project.assigneeIds.includes(member.$id);
    }
  );

  return (
    <div className="flex flex-col gap-y-6 rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-12"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            {project.startDate && project.endDate ? (
              <p className="text-sm text-gray-500">
                {formatDate(project.startDate)} {" -> "}{" "}
                {formatDate(project.endDate)}
              </p>
            ) : (
              <>
                {project.startDate && (
                  <p className="text-sm text-gray-500">
                    Started on {formatDate(project.startDate)}
                  </p>
                )}
                {project.endDate && (
                  <p className="text-sm text-gray-500">
                    Ends on {formatDate(project.endDate)}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          asChild
        >
          <Link
            href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
          >
            <PencilIcon className="mr-1" />
            Edit Project
          </Link>
        </Button>
      </div>
      <div>
        <h2 className="text-lg font-semibold">Assignees</h2>
        <div className="mt-2 flex flex-wrap gap-4">
          {assignees?.length ? (
            assignees.map(
              (assignee: Member): ReactElement => (
                <div
                  key={assignee.$id}
                  className="flex items-center gap-x-2 rounded-lg bg-gray-100 p-2"
                >
                  <MemberAvatar
                    member={assignee}
                    className="size-8"
                  />
                  <span className="text-sm font-medium">{assignee.name}</span>
                </div>
              )
            )
          ) : (
            <p className="text-sm text-gray-500">No assignees</p>
          )}
        </div>
      </div>
      {analytics && <Analytics data={analytics} />}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};
