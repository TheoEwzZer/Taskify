import { client } from "@/lib/rpc";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ClientResponse } from "hono/client";
import { StatusCode } from "hono/utils/http-status";
import { Task } from "../types";

interface UseGetTaskProps {
  taskId: string;
}

export const useGetTask: ({
  taskId,
}: UseGetTaskProps) => UseQueryResult<Task, Error> = ({ taskId }) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async (): Promise<Task> => {
      const response:
        | ClientResponse<{ error: string }, 401 | 404, "json">
        | ClientResponse<{ data: Task }, StatusCode, "json"> =
        await client.api.tasks[":taskId"]["$get"]({
          param: {
            taskId,
          },
        });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const { data } = await response.json();

      const transformedData: Task = {
        ...data,
        assignee: data.assignee,
      };

      return transformedData;
    },
  });
};
