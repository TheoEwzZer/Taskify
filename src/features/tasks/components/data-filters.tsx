import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMembers } from "@/features/members/api/use-get-member";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { FolderIcon, ListChecksIcon, UserIcon } from "lucide-react";
import { Models } from "node-appwrite";
import { ReactElement } from "react";
import { useTaskFilters } from "../hooks/use-task-filters";
import { TaskStatus } from "../types";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

export const DataFilters: ({
  hideProjectFilter,
}: DataFiltersProps) => ReactElement | null = ({
  hideProjectFilter,
}: DataFiltersProps) => {
  const workspaceId: string = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading: boolean = isLoadingProjects || isLoadingMembers;

  const projectOptions:
    | {
        value: string;
        label: string;
      }[]
    | undefined = projects?.documents.map((project: Models.Document) => ({
    value: project.$id,
    label: project.name,
  }));

  const memberOptions:
    | {
        value: string;
        label: string;
      }[]
    | undefined = members?.documents.map(
    (
      member: Models.Document & {
        name: string;
        email: string;
      }
    ) => ({
      value: member.$id,
      label: member.name,
    })
  );

  const [{ status, assigneeId, projectId, dueDate }, setFilters] =
    useTaskFilters();

  const onStatusChange: (value: string) => void = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  };

  const onAssigneeChange: (value: string) => void = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : value });
  };

  const onProjectChange: (value: string) => void = (value: string) => {
    setFilters({ projectId: value === "all" ? null : value });
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value: string): void => onStatusChange(value)}
      >
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="mr-2 size-4" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.TODO}>To do</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In review</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value: string): void => onAssigneeChange(value)}
      >
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <UserIcon className="mr-2 size-4" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {memberOptions?.map(
            (member: { value: string; label: string }): ReactElement => (
              <SelectItem
                key={member.value}
                value={member.value}
              >
                {member.label}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
      <Select
        defaultValue={projectId ?? undefined}
        onValueChange={(value: string): void => onProjectChange(value)}
      >
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <FolderIcon className="mr-2 size-4" />
            <SelectValue placeholder="All projects" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All projects</SelectItem>
          <SelectSeparator />
          {projectOptions?.map(
            (project: { value: string; label: string }): ReactElement => (
              <SelectItem
                key={project.value}
                value={project.value}
              >
                {project.label}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>
      <DatePicker
        placeholder="Due date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date: Date): Promise<URLSearchParams> =>
          setFilters({ dueDate: date ? date.toISOString() : null })
        }
      />
    </div>
  );
};
