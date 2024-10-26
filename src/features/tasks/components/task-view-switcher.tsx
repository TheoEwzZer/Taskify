"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { ReactElement } from "react";
import { useGetTasks } from "../api/use-get-tasks";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useTaskFilters } from "../hooks/use-task-filters";
import { DataFilters } from "./data-filters";

export const TaskViewSwitcher: () => ReactElement = () => {
  const [{ status, assigneeId, projectId, dueDate }] = useTaskFilters();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const workspaceId: string = useWorkspaceId();
  const { open } = useCreateTaskModal();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    projectId,
    status,
    assigneeId,
    dueDate,
  });

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="w-full flex-1 rounded-lg border"
    >
      <div className="flex h-full flex-col overflow-auto p-4">
        <div className="flex flex-col items-center justify-between gap-y-2 md:flex-row">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger
              className="h-8 w-full md:w-auto"
              value="table"
            >
              Table
            </TabsTrigger>
            <TabsTrigger
              className="h-8 w-full md:w-auto"
              value="kanban"
            >
              Kanban
            </TabsTrigger>
            <TabsTrigger
              className="h-8 w-full md:w-auto"
              value="calendar"
            >
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button
            size="sm"
            className="w-full md:w-auto"
            onClick={open}
          >
            <PlusIcon className="mr-2 size-4" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border">
            <Loader className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent
              value="table"
              className="mt-0"
            >
              {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent
              value="kanban"
              className="mt-0"
            >
              {JSON.stringify(tasks)}
            </TabsContent>
            <TabsContent
              value="calendar"
              className="mt-0"
            >
              {JSON.stringify(tasks)}
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
