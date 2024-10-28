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
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.workspaces.$post>;
type RequestType = InferRequestType<typeof client.api.workspaces.$post>;

export const useCreateWorkspace: () => UseMutationResult<
  ResponseType,
  Error,
  RequestType,
  unknown
> = () => {
  const router: AppRouterInstance = useRouter();
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response: ClientResponse<ResponseType, StatusCode, "json"> =
        await client.api.workspaces.$post({ form });
      return await response.json();
    },
    onSuccess: (): void => {
      toast.success("Workspace created successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (): void => {
      toast.error("Failed to create workspace");
    },
  });
};
