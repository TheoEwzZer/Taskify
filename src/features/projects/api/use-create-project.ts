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

type ResponseType = InferResponseType<typeof client.api.projects.$post, 200>;
type RequestType = InferRequestType<typeof client.api.projects.$post>;

export const useCreateProject: () => UseMutationResult<
  ResponseType,
  Error,
  RequestType,
  unknown
> = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response:
        | ClientResponse<{ error: string }, 401, "json">
        | ClientResponse<ResponseType, StatusCode, "json"> =
        await client.api.projects.$post({ form });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      return await response.json();
    },
    onSuccess: (): void => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (): void => {
      toast.error("Failed to create project");
    },
  });
};
