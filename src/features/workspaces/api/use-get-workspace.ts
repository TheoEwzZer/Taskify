import { client } from "@/lib/rpc";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ClientResponse } from "hono/client";
import { StatusCode } from "hono/utils/http-status";
import { Workspace } from "../types";

interface UseGetWorkspaceProps {
  workspaceId: string;
}

export const useGetWorkspace: ({
  workspaceId,
}: UseGetWorkspaceProps) => UseQueryResult<Workspace, Error> = ({
  workspaceId,
}) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async (): Promise<Workspace> => {
      const response:
        | ClientResponse<{ error: string }, 401 | 404, "json">
        | ClientResponse<{ data: Workspace }, StatusCode, "json"> =
        await client.api.workspaces[":workspaceId"]["$get"]({
          param: { workspaceId },
        });

      if (!response.ok) {
        throw new Error("Failed to fetch workspace");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
