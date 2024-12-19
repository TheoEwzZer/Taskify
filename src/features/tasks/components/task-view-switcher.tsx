"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { ReactElement, useCallback } from "react";
import { useBulkUpdateTask } from "../api/use-bulk-update-task";
import { useGetTasks } from "../api/use-get-tasks";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useTaskFilters } from "../hooks/use-task-filters";
import { TaskStatus } from "../types";
import { DataCalendar } from "./calendar/data-calendar";
import { DataFilters } from "./data-filters";
import { DataKanban } from "./kanban/data-kanban";
import { columns } from "./table/columns";
import { DataTable } from "./table/data-table";

interface TaskViewSwitcherProps {
  onlyAssigned?: string;
  hideProjectFilter?: boolean;
  hideAssigneeFilter?: boolean;
}

export const TaskViewSwitcher: ({
  onlyAssigned,
  hideProjectFilter,
  hideAssigneeFilter,
}: TaskViewSwitcherProps) => ReactElement = ({
  onlyAssigned = "false",
  hideProjectFilter,
  hideAssigneeFilter,
}) => {
  const [{ status, assigneeId, projectId, dueDate }] = useTaskFilters();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const workspaceId: string = useWorkspaceId();
  const paramProjectId: string = useProjectId();
  const { open } = useCreateTaskModal();

  const { mutate: bulkUpdate } = useBulkUpdateTask();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId: paramProjectId ? [paramProjectId] : projectId,
    status,
    assigneeId,
    dueDate,
    onlyAssigned,
  });

  const onKanbanChange: (
    tasks: {
      $id: string;
      status: TaskStatus;
      position: number;
    }[]
  ) => void = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]): void => {
      bulkUpdate({
        json: { tasks },
      });
    },
    [bulkUpdate]
  );

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="w-full flex-1 rounded-lg border"
    >
      <div className="flex h-full flex-col overflow-auto p-4">
        <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger
              className="h-8 w-full lg:w-auto"
              value="table"
            >
              Table
            </TabsTrigger>
            <TabsTrigger
              className="h-8 w-full lg:w-auto"
              value="kanban"
            >
              Kanban
            </TabsTrigger>
            <TabsTrigger
              className="h-8 w-full lg:w-auto"
              value="calendar"
            >
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button
            size="sm"
            className="w-full text-white dark:text-black lg:w-auto"
            onClick={(): Promise<URLSearchParams> => open()}
          >
            <PlusIcon />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters
          hideProjectFilter={hideProjectFilter}
          hideAssigneeFilter={hideAssigneeFilter}
          currentProjectId={paramProjectId}
        />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <PageLoader />
        ) : (
          <>
            <TabsContent
              value="table"
              className="mt-0"
            >
              <DataTable
                columns={columns}
                data={tasks?.documents ?? []}
              />
            </TabsContent>
            <TabsContent
              value="kanban"
              className="mt-0"
            >
              <DataKanban
                data={tasks?.documents ?? []}
                onChange={onKanbanChange}
              />
            </TabsContent>
            <TabsContent
              value="calendar"
              className="mt-0 h-full pb-4"
            >
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
