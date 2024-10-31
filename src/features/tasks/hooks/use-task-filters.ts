import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringEnum,
  ParserBuilder,
  useQueryStates,
  UseQueryStatesReturn,
} from "nuqs";
import { TaskStatus } from "../types";

export const useTaskFilters: () => UseQueryStatesReturn<{
  projectId: ParserBuilder<string[]>;
  status: ParserBuilder<TaskStatus[]>;
  assigneeId: ParserBuilder<string[]>;
  dueDate: ParserBuilder<string>;
}> = () => {
  return useQueryStates({
    projectId: parseAsArrayOf(parseAsString),
    status: parseAsArrayOf(parseAsStringEnum(Object.values(TaskStatus))),
    assigneeId: parseAsArrayOf(parseAsString),
    dueDate: parseAsString,
  });
};
