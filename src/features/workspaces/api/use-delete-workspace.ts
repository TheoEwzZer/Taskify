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
  (typeof client.api.workspaces)[":workspaceId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>;

export const useDeleteWorkspace: () => UseMutationResult<
  ResponseType,
  Error,
  RequestType,
  unknown
> = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response:
        | ClientResponse<{ error: string }, 404, "json">
        | ClientResponse<{ data: { $id: string } }, StatusCode, "json"> =
        await client.api.workspaces[":workspaceId"]["$delete"]({
          param,
        });

      if (!response.ok) {
        throw new Error("Failed to delete workspace");
      }

      return await response.json();
    },
    onSuccess: ({ data }: { data: { $id: string } }): void => {
      toast.success("Workspace deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: (): void => {
      toast.error("Failed to delete workspace");
    },
  });
};
