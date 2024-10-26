import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { ClientResponse } from "hono/client";
import { StatusCode } from "hono/utils/http-status";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { Models } from "node-appwrite";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$patch"]
>;

export const useUpdateTask: () => UseMutationResult<
  ResponseType,
  Error,
  RequestType,
  unknown
> = () => {
  const router: AppRouterInstance = useRouter();
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response:
        | ClientResponse<
            {
              error: string;
            },
            401,
            "json"
          >
        | ClientResponse<{ data: Models.Document }, StatusCode, "json"> =
        await client.api.tasks[":taskId"]["$patch"]({ json, param });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      return await response.json();
    },
    onSuccess: ({ data }: { data: Models.Document }): void => {
      toast.success("Task updated successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
    },
    onError: (): void => {
      toast.error("Failed to update task");
    },
  });
};
