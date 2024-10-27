import { client } from "@/lib/rpc";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ClientResponse } from "hono/client";
import { StatusCode } from "hono/utils/http-status";
import { Member } from "../types";

interface UseGetMembersProps {
  workspaceId: string;
}

export const useGetMembers: ({
  workspaceId,
}: UseGetMembersProps) => UseQueryResult<
  { documents: Member[]; total: number },
  Error
> = ({ workspaceId }) => {
  return useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async (): Promise<{ documents: Member[]; total: number }> => {
      const response:
        | ClientResponse<{ error: string }, 401, "json">
        | ClientResponse<
            { data: { documents: Member[]; total: number } },
            StatusCode,
            "json"
          > = await client.api.members.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
