import { client } from "@/lib/rpc";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Models } from "node-appwrite";

interface UseGetProjectsProps {
  workspaceId: string;
}

export const useGetProjects: ({
  workspaceId,
}: UseGetProjectsProps) => UseQueryResult<
  {
    total: number;
    documents: Models.Document[];
  },
  Error
> = ({ workspaceId }: UseGetProjectsProps) => {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.$get({
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
