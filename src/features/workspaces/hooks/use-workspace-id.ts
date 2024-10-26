import { useParams } from "next/navigation";

export const useWorkspaceId: () => string = () => {
  const params = useParams();
  return params.workspaceId as string;
};
