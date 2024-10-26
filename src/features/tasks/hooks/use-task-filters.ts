import {
  parseAsString,
  parseAsStringEnum,
  ParserBuilder,
  useQueryStates,
  UseQueryStatesReturn,
} from "nuqs";
import { TaskStatus } from "../types";

export const useTaskFilters: () => UseQueryStatesReturn<{
  projectId: ParserBuilder<string>;
  status: ParserBuilder<TaskStatus>;
  assigneeId: ParserBuilder<string>;
  search: ParserBuilder<string>;
  dueDate: ParserBuilder<string>;
}> = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
};
