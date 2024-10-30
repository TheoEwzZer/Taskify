import { DatePicker } from "@/components/date-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useGetMembers } from "@/features/members/api/use-get-member";
import { Member } from "@/features/members/types";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { Project } from "@/features/projects/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  CheckIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  FolderIcon,
  ListChecksIcon,
  UserIcon,
} from "lucide-react";
import { ReactElement, ReactNode } from "react";
import { useTaskFilters } from "../hooks/use-task-filters";
import { TaskStatus } from "../types";

interface TaskStatusOption {
  value: TaskStatus;
  label: string;
  icon: ReactNode;
}

interface DataFiltersProps {
  hideProjectFilter?: boolean;
  hideAssigneeFilter?: boolean;
}

export const DataFilters: ({
  hideProjectFilter,
  hideAssigneeFilter,
}: DataFiltersProps) => ReactElement | null = ({
  hideProjectFilter,
  hideAssigneeFilter,
}: DataFiltersProps) => {
  const workspaceId: string = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading: boolean = isLoadingProjects || isLoadingMembers;

  const projectOptions: Project[] | undefined = projects?.documents;

  const memberOptions: Member[] | undefined = members?.documents;

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

  const options: TaskStatusOption[] = [
    {
      value: TaskStatus.BACKLOG,
      label: "Backlog",
      icon: <CircleDashedIcon className="size-[18px] text-pink-400" />,
    },
    {
      value: TaskStatus.TODO,
      label: "Todo",
      icon: <CircleIcon className="size-[18px] text-red-400" />,
    },
    {
      value: TaskStatus.IN_PROGRESS,
      label: "In progress",
      icon: <CircleDotDashedIcon className="size-[18px] text-yellow-400" />,
    },
    {
      value: TaskStatus.IN_REVIEW,
      label: "In review",
      icon: <CircleDotIcon className="size-[18px] text-blue-400" />,
    },
    {
      value: TaskStatus.DONE,
      label: "Done",
      icon: <CircleCheckIcon className="size-[18px] text-emerald-400" />,
    },
  ];

  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-dashed"
          >
            <ListChecksIcon className="h-4 w-4" />
            Status
            {status && (
              <>
                <Separator
                  orientation="vertical"
                  className="mx-2 h-4"
                />
                <div className="flex space-x-1">
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {
                      options.find(
                        (option: TaskStatusOption): boolean =>
                          option.value === status
                      )?.label
                    }
                  </Badge>
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[200px] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Status" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option: TaskStatusOption): ReactElement => {
                  const isSelected: boolean = status === option.value;
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={(): void => {
                        onStatusChange(
                          isSelected ? "all" : (option.value as string)
                        );
                        setFilters({
                          status: isSelected ? null : option.value,
                        });
                      }}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className={cn("h-4 w-4")} />
                      </div>
                      {option.icon}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {status && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={(): void => {
                        onStatusChange("all");
                        setFilters({ status: null });
                      }}
                      className="justify-center text-center"
                    >
                      Clear filters
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {!hideAssigneeFilter && memberOptions && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-dashed"
            >
              <UserIcon className="h-4 w-4" />
              Assignee
              {assigneeId && (
                <>
                  <Separator
                    orientation="vertical"
                    className="mx-2 h-4"
                  />
                  <div className="flex space-x-1">
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {
                        memberOptions.find(
                          (option: Member): boolean => option.$id === assigneeId
                        )?.name
                      }
                    </Badge>
                  </div>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[200px] p-0"
            align="start"
          >
            <Command>
              <CommandInput placeholder="Assignee" />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {memberOptions.map((option: Member): ReactElement => {
                    const isSelected: boolean = assigneeId === option.$id;
                    return (
                      <CommandItem
                        key={option.$id}
                        onSelect={(): void => {
                          onAssigneeChange(option.$id);
                          setFilters({
                            assigneeId: option.$id,
                          });
                        }}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <CheckIcon className={cn("h-4 w-4")} />
                        </div>
                        <span>{option.name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {assigneeId && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={(): void => {
                          onAssigneeChange("all");
                          setFilters({ assigneeId: null });
                        }}
                        className="justify-center text-center"
                      >
                        Clear filters
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
      {!hideProjectFilter && projectOptions && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-dashed"
            >
              <FolderIcon className="h-4 w-4" />
              Project
              {projectId && (
                <>
                  <Separator
                    orientation="vertical"
                    className="mx-2 h-4"
                  />
                  <div className="flex space-x-1">
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {
                        projectOptions.find(
                          (option: Project): boolean => option.$id === projectId
                        )?.name
                      }
                    </Badge>
                  </div>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[200px] p-0"
            align="start"
          >
            <Command>
              <CommandInput placeholder="Assignee" />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {projectOptions.map((option: Project): ReactElement => {
                    const isSelected: boolean = projectId === option.$id;
                    return (
                      <CommandItem
                        key={option.$id}
                        onSelect={(): void => {
                          onProjectChange(option.$id);
                          setFilters({
                            projectId: option.$id,
                          });
                        }}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <CheckIcon className={cn("h-4 w-4")} />
                        </div>
                        <span>{option.name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {projectId && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={(): void => {
                          onProjectChange("all");
                          setFilters({ projectId: null });
                        }}
                        className="justify-center text-center"
                      >
                        Clear filters
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
      <DatePicker
        placeholder="Due date"
        className="h-8 w-full border-dashed lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date: Date | undefined): Promise<URLSearchParams> =>
          setFilters({ dueDate: date ? date.toISOString() : null })
        }
      />
      {(status || assigneeId || projectId || dueDate) && (
        <Button
          variant="ghost"
          onClick={(): void => {
            setFilters({
              status: null,
              assigneeId: null,
              projectId: null,
              dueDate: null,
            });
            onStatusChange("all");
            onAssigneeChange("all");
            onProjectChange("all");
          }}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <Cross2Icon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
