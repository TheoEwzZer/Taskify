import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { ClientResponse } from "hono/client";
import { StatusCode } from "hono/utils/http-status";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>;

export const useBulkDeleteTasks: () => UseMutationResult<
  ResponseType[],
  Error,
  RequestType[],
  unknown
> = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseType[], Error, RequestType[]>({
    mutationFn: async (tasks: RequestType[]): Promise<ResponseType[]> => {
      return await Promise.all(
        tasks.map(async ({ param }: RequestType): Promise<ResponseType> => {
          const response:
            | ClientResponse<{ error: string }, 401 | 404, "json">
            | ClientResponse<{ data: { $id: string } }, StatusCode, "json"> =
            await client.api.tasks[":taskId"]["$delete"]({ param });

          if (!response.ok) {
            throw new Error("Failed to delete task");
          }

          return await response.json();
        })
      );
    },
    onSuccess: (data: ResponseType[]): void => {
      toast.success("Tasks deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      data.forEach(({ data }: ResponseType): void => {
        queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
      });
    },
    onError: (): void => {
      toast.error("Failed to delete tasks");
    },
  });
};
