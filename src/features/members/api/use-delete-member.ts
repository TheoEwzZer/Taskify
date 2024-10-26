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
  (typeof client.api.members)[":memberId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;

export const useDeleteMember: () => UseMutationResult<
  ResponseType,
  Error,
  RequestType,
  unknown
> = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }: { param: { memberId: string } }) => {
      const response:
        | ClientResponse<
            {
              error: string;
            },
            400 | 401 | 404,
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
          > = await client.api.members[":memberId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to delete member");
      }

      return await response.json();
    },
    onSuccess: (): void => {
      toast.success("Member deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (): void => {
      toast.error("Failed to delete member");
    },
  });
};
