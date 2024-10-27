import { client } from "@/lib/rpc";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ClientResponse } from "hono/client";
import { StatusCode } from "hono/utils/http-status";

interface UseGetWorkspaceInfoProps {
  workspaceId: string;
}

export const useGetWorkspaceInfo: ({
  workspaceId,
}: UseGetWorkspaceInfoProps) => UseQueryResult<{ name: string }, Error> = ({
  workspaceId,
}) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async (): Promise<{ name: string }> => {
      const response:
        | ClientResponse<{ error: string }, 404, "json">
        | ClientResponse<{ data: { name: string } }, StatusCode, "json"> =
        await client.api.workspaces[":workspaceId"]["info"]["$get"]({
          param: { workspaceId },
        });

      if (!response.ok) {
        throw new Error("Failed to fetch workspace info");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
