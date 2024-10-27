import { useParams } from "next/navigation";

export const useProjectId: () => string = () => {
  const params = useParams();
  return params.projectId as string;
};
