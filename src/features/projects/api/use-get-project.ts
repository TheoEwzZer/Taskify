import { client } from "@/lib/rpc";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ClientResponse } from "hono/client";
import { StatusCode } from "hono/utils/http-status";
import { Project } from "../types";

interface UseGetProjectProps {
  projectId: string;
}

export const useGetProject: ({
  projectId,
}: UseGetProjectProps) => UseQueryResult<Project, Error> = ({
  projectId,
}: UseGetProjectProps) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async (): Promise<Project> => {
      const response:
        | ClientResponse<{ error: string }, 401 | 404, "json">
        | ClientResponse<{ data: Project }, StatusCode, "json"> =
        await client.api.projects[":projectId"]["$get"]({
          param: { projectId },
        });

      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
