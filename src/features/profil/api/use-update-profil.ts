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

type ResponseType = InferResponseType<typeof client.api.profil.$patch, 200>;

type RequestType = InferRequestType<typeof client.api.profil.$patch>;

export const useUpdateProfil: () => UseMutationResult<
  ResponseType,
  Error,
  RequestType,
  unknown
> = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response:
        | ClientResponse<{ error: string }, 400 | 500, "json">
        | ClientResponse<{ success: boolean }, StatusCode, "json"> =
        await client.api.profil.$patch({ form });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      return await response.json();
    },
    onSuccess: (): void => {
      toast.success("Profil updated successfully");
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: (): void => {
      toast.error("Failed to update profil");
    },
  });
};
