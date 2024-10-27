import { client } from "@/lib/rpc";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ClientResponse, InferResponseType } from "hono/client";
import { StatusCode } from "hono/utils/http-status";

interface UseGetProjectAnalyticsProps {
  projectId: string;
}

export type ProjectAnalyticsResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["analytics"]["$get"],
  200
>;

export const useGetProjectAnalytics: ({
  projectId,
}: UseGetProjectAnalyticsProps) => UseQueryResult<
  ProjectAnalyticsResponseType["data"],
  Error
> = ({ projectId }: UseGetProjectAnalyticsProps) => {
  return useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async (): Promise<ProjectAnalyticsResponseType["data"]> => {
      const response:
        | ClientResponse<{ error: string }, 401 | 404, "json">
        | ClientResponse<ProjectAnalyticsResponseType, StatusCode, "json"> =
        await client.api.projects[":projectId"]["analytics"]["$get"]({
          param: { projectId },
        });

      if (!response.ok) {
        throw new Error("Failed to fetch project analytics");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
