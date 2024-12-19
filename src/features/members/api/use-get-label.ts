import { client } from "@/lib/rpc";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ClientResponse } from "hono/client";
import { StatusCode } from "hono/utils/http-status";

interface UseGetLabelProps {
  workspaceId: string;
}

export const useGetLabel: ({
  workspaceId,
}: UseGetLabelProps) => UseQueryResult<{ labels: string[] }, Error> = ({
  workspaceId,
}) => {
  return useQuery({
    queryKey: ["label", workspaceId],
    queryFn: async (): Promise<{ labels: string[] }> => {
      const response:
        | ClientResponse<{ error: string }, 404, "json">
        | ClientResponse<{ data: { labels: string[] } }, StatusCode, "json"> =
        await client.api.workspaces[":workspaceId"]["labels"]["$get"]({
          param: { workspaceId },
        });

      if (!response.ok) {
        throw new Error("Failed to fetch label");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
