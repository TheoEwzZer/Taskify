"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import { TaskBreadcrumbs } from "@/features/tasks/components/task/task-breadcrumbs";
import { TaskDescription } from "@/features/tasks/components/task/task-description";
import { TaskOverview } from "@/features/tasks/components/task/task-overview";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";
import { ReactElement } from "react";

export const TaskIdClient: () => ReactElement = () => {
  const taskId: string = useTaskId();
  const { data, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Task not found" />;
  }

  return (
    <div className="flex flex-col">
      {data.project && (
        <>
          <TaskBreadcrumbs
            project={data.project}
            task={data}
          />
          <DottedSeparator className="my-6" />
        </>
      )}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  );
};
