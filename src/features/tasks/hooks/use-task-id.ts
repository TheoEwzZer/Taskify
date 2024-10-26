import { useParams } from "next/navigation";

export const useTaskId: () => string = () => {
  const params = useParams();
  return params.taskId as string;
};
