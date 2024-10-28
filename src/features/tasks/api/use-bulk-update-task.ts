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
  (typeof client.api.tasks)["bulk-update"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)["bulk-update"]["$post"]
>;

export const useBulkUpdateTask: () => UseMutationResult<
  ResponseType,
  Error,
  RequestType,
  unknown
> = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response:
        | ClientResponse<{ error: string }, 400 | 401, "json">
        | ClientResponse<ResponseType, StatusCode, "json"> =
        await client.api.tasks["bulk-update"]["$post"]({ json });

      if (!response.ok) {
        throw new Error("Failed to update tasks");
      }

      return await response.json();
    },
    onSuccess: (): void => {
      toast.success("Tasks updated successfully");
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (): void => {
      toast.error("Failed to update tasks");
    },
  });
};
