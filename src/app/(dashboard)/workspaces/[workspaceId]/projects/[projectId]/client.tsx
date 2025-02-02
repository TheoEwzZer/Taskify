"use client";

import { Analytics } from "@/components/analytics";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetMembers } from "@/features/members/api/use-get-member";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { Member } from "@/features/members/types";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { DatesString } from "@/features/projects/types";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { format } from "date-fns";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { CSSProperties, ReactElement } from "react";

export const formatDate = (dateString: string | undefined): string => {
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
    <div className="bg-background flex flex-col gap-y-6 rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-12"
          />
          <div className="flex flex-col">
            <div className="flex gap-2">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              {project.label && (
                <Badge variant="secondary">{project.label}</Badge>
              )}
            </div>
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
      <div className="flex flex-row justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Assignees</h2>
          <div className="flex flex-wrap gap-4">
            {assignees?.length ? (
              <div className="flex items-center">
                {assignees.map(
                  (assignee: Member, index: number): ReactElement => (
                    <div
                      key={assignee.$id}
                      className="relative z-(--index) hover:z-1000"
                      style={
                        {
                          marginLeft: index !== 0 ? "-5px" : "0",
                          "--index": assignees.length - index,
                        } as CSSProperties
                      }
                    >
                      <MemberAvatar
                        member={assignee}
                        className="mb-1.5 size-8"
                      />
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No assignees</p>
            )}
          </div>
        </div>
        {project.dates?.length > 0 && (
          <div>
            <h2 className="text-end text-lg font-semibold">Important Dates</h2>
            <div className="flex flex-wrap justify-end gap-2">
              {project.dates?.map(
                (date: DatesString): ReactElement => (
                  <Badge
                    key={`${date.title}-${formatDate(date.date)}`}
                    variant="secondary"
                  >
                    {date.title} - {format(new Date(date.date), "PPP")}
                  </Badge>
                )
              )}
            </div>
          </div>
        )}
      </div>
      {analytics && <Analytics data={analytics} />}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};
