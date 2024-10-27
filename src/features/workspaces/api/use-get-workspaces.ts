import { client } from "@/lib/rpc";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ClientResponse } from "hono/client";
import { StatusCode } from "hono/utils/http-status";
import { Workspace } from "../types";

export const useGetWorkspaces: () => UseQueryResult<
  { total: number; documents: Workspace[] } | null,
  Error
> = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async (): Promise<{
      total: number;
      documents: Workspace[];
    }> => {
      const response: ClientResponse<
        { data: { total: number; documents: Workspace[] } },
        StatusCode,
        "json"
      > = await client.api.workspaces.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
