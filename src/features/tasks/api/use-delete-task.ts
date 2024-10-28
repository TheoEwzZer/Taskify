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

export const useDeleteTask: () => UseMutationResult<
  ResponseType,
  Error,
  RequestType,
  unknown
> = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response:
        | ClientResponse<
            {
              error: string;
            },
            401 | 404,
            "json"
          >
        | ClientResponse<
            {
              data: {
                $id: string;
              };
            },
            StatusCode,
            "json"
          > = await client.api.tasks[":taskId"]["$delete"]({ param });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      return await response.json();
    },
    onSuccess: ({ data }: { data: { $id: string } }): void => {
      toast.success("Task deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
    },
    onError: (): void => {
      toast.error("Failed to delete task");
    },
  });
};
