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
import { Workspace } from "../types";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"]
>;

export const useResetInviteCode: () => UseMutationResult<
  ResponseType,
  Error,
  RequestType,
  unknown
> = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response:
        | ClientResponse<{ error: string }, 401, "json">
        | ClientResponse<ResponseType, StatusCode, "json"> =
        await client.api.workspaces[":workspaceId"]["reset-invite-code"][
          "$post"
        ]({ param });

      if (!response.ok) {
        throw new Error("Failed to reset invite code");
      }

      return await response.json();
    },
    onSuccess: ({ data }: { data: Workspace }): void => {
      toast.success("Invite code reset successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: (): void => {
      toast.error("Failed to reset invite code");
    },
  });
};
