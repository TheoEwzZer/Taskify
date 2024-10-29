import { parseAsBoolean, useQueryState } from "nuqs";
import { TaskStatus } from "../types";

export const useCreateTaskModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );
  const [, setStatus] = useQueryState("task-status");

  const open: (status?: TaskStatus) => Promise<URLSearchParams> = (status?) => {
    if (status) {
      setStatus(status);
    } else {
      setStatus(null);
    }
    return setIsOpen(true);
  };
  const close: () => Promise<URLSearchParams> = () => {
    setStatus(null);
    return setIsOpen(false);
  };

  return { isOpen, open, close, setIsOpen, setStatus };
};
