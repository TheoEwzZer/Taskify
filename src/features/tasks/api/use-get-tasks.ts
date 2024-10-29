import { client } from "@/lib/rpc";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ClientResponse } from "hono/client";
import { StatusCode } from "hono/utils/http-status";
import { Task, TaskStatus } from "../types";

interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  onlyAssigned?: string | null;
}

export const useGetTasks: ({
  workspaceId,
  projectId,
  status,
  assigneeId,
  dueDate,
  onlyAssigned,
}: UseGetTasksProps) => UseQueryResult<
  { documents: Task[]; total: number },
  Error
> = ({
  workspaceId,
  projectId,
  status,
  assigneeId,
  dueDate,
  onlyAssigned,
}) => {
  return useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      status,
      assigneeId,
      dueDate,
      onlyAssigned,
    ],
    queryFn: async (): Promise<{ documents: Task[]; total: number }> => {
      const response:
        | ClientResponse<{ error: string }, 401, "json">
        | ClientResponse<
            { data: { documents: Task[]; total: number } },
            StatusCode,
            "json"
          > = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
          onlyAssigned: onlyAssigned ?? undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
