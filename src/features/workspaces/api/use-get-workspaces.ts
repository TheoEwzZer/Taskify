import { client } from "@/lib/rpc";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ClientResponse } from "hono/client";
import { StatusCode } from "hono/utils/http-status";

export const useGetWorkspaces: () => UseQueryResult<
  {
    total: number;
    documents: {
      [x: string]: any;
      $id: string;
      $collectionId: string;
      $databaseId: string;
      $createdAt: string;
      $updatedAt: string;
      $permissions: string[];
    }[];
  } | null,
  Error
> = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response: ClientResponse<
        {
          data: {
            total: number;
            documents: {
              [x: string]: any;
              $id: string;
              $collectionId: string;
              $databaseId: string;
              $createdAt: string;
              $updatedAt: string;
              $permissions: string[];
            }[];
          };
        },
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
