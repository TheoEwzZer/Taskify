import { parseAsString, useQueryState } from "nuqs";

export const useEditTaskModal = () => {
  const [taskId, setTaskId] = useQueryState("edit-task", parseAsString);

  const open: (id: string) => Promise<URLSearchParams> = (id) => setTaskId(id);
  const close: () => Promise<URLSearchParams> = () => setTaskId(null);

  return { taskId, open, close, setTaskId };
};
