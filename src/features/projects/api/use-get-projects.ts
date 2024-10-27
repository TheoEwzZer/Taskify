import { client } from "@/lib/rpc";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ClientResponse } from "hono/client";
import { StatusCode } from "hono/utils/http-status";
import { Project } from "../types";

interface UseGetProjectsProps {
  workspaceId: string;
}

export const useGetProjects: ({
  workspaceId,
}: UseGetProjectsProps) => UseQueryResult<
  {
    total: number;
    documents: Project[];
  },
  Error
> = ({ workspaceId }) => {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async (): Promise<{ total: number; documents: Project[] }> => {
      const response:
        | ClientResponse<{ error: string }, 400 | 401, "json">
        | ClientResponse<
            { data: { total: number; documents: Project[] } },
            StatusCode,
            "json"
          > = await client.api.projects.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
