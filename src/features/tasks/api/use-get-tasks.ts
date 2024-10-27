import { client } from "@/lib/rpc";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ClientResponse } from "hono/client";
import { StatusCode } from "hono/utils/http-status";
import { Task, TaskStatus } from "../types";

interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  search?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
}

export const useGetTasks: ({
  workspaceId,
  projectId,
  status,
  search,
  assigneeId,
  dueDate,
}: UseGetTasksProps) => UseQueryResult<
  { documents: Task[]; total: number },
  Error
> = ({ workspaceId, projectId, status, search, assigneeId, dueDate }) => {
  return useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      status,
      search,
      assigneeId,
      dueDate,
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
          search: search ?? undefined,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
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
