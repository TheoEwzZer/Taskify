import { client } from "@/lib/rpc";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ClientResponse, InferResponseType } from "hono/client";
import { StatusCode } from "hono/utils/http-status";

interface UseGetWorkspaceAnalyticsProps {
  workspaceId: string;
}

export type WorkspaceAnalyticsResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["analytics"]["$get"],
  200
>;

export const useGetWorkspaceAnalytics: ({
  workspaceId,
}: UseGetWorkspaceAnalyticsProps) => UseQueryResult<
  WorkspaceAnalyticsResponseType["data"],
  Error
> = ({ workspaceId }: UseGetWorkspaceAnalyticsProps) => {
  return useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async (): Promise<WorkspaceAnalyticsResponseType["data"]> => {
      const response:
        | ClientResponse<{ error: string }, 401 | 404, "json">
        | ClientResponse<WorkspaceAnalyticsResponseType, StatusCode, "json"> =
        await client.api.workspaces[":workspaceId"]["analytics"]["$get"]({
          param: { workspaceId },
        });

      if (!response.ok) {
        throw new Error("Failed to fetch workspace analytics");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
