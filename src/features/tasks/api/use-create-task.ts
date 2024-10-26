import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { ClientResponse } from "hono/client";
import { StatusCode } from "hono/utils/http-status";
import { Models } from "node-appwrite";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.tasks.$post, 200>;
type RequestType = InferRequestType<typeof client.api.tasks.$post>;

export const useCreateTask: () => UseMutationResult<
  ResponseType,
  Error,
  RequestType,
  unknown
> = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response:
        | ClientResponse<
            {
              error: string;
            },
            401,
            "json"
          >
        | ClientResponse<{ data: Models.Document }, StatusCode, "json"> =
        await client.api.tasks.$post({ json });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      return await response.json();
    },
    onSuccess: (): void => {
      toast.success("Task created successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (): void => {
      toast.error("Failed to create task");
    },
  });
};
