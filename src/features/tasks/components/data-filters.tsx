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
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { Member } from "@/features/members/types";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Project } from "@/features/projects/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
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
import { ParserBuilder, Values } from "nuqs";
import {
  CSSProperties,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useTaskFilters } from "../hooks/use-task-filters";
import { TaskStatus } from "../types";

export interface TaskStatusOption {
  value: TaskStatus;
  label: string;
  icon: ReactNode;
}

interface DataFiltersProps {
  hideProjectFilter?: boolean;
  hideAssigneeFilter?: boolean;
  currentProjectId: string | undefined;
}

export const taskOptions: TaskStatusOption[] = [
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

export const DataFilters: ({
  hideProjectFilter,
  hideAssigneeFilter,
  currentProjectId,
}: DataFiltersProps) => ReactElement | null = ({
  hideProjectFilter,
  hideAssigneeFilter,
  currentProjectId,
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
  const [filteredMembers, setFilteredMembers] = useState<Member[]>(
    memberOptions ?? []
  );

  const [{ status, assigneeId, projectId, dueDate }, setFilters] =
    useTaskFilters();

  useEffect((): void => {
    if (currentProjectId && memberOptions && projectOptions) {
      const selectedProject: Project | undefined = projectOptions.find(
        (project: Project): boolean => project.$id === currentProjectId
      );

      if (selectedProject) {
        const assigneeIds: string[] = selectedProject.assigneeIds;
        const filtered: Member[] = memberOptions.filter(
          (member: Member): boolean => assigneeIds.includes(member.$id)
        );
        setFilteredMembers(filtered);
      } else {
        setFilteredMembers(memberOptions);
      }
    } else if (memberOptions) {
      setFilteredMembers(memberOptions);
    } else {
      setFilteredMembers([]);
    }
  }, [projectId, projectOptions, memberOptions]);

  const onStatusChange: (value: string) => void = (value) => {
    if (value === "all") {
      setFilters({ status: null });
      return;
    }
    const newStatus = value as TaskStatus;
    setFilters(
      (
        prev: Values<{
          projectId: ParserBuilder<string[]>;
          status: ParserBuilder<TaskStatus[]>;
          assigneeId: ParserBuilder<string[]>;
          dueDate: ParserBuilder<string>;
        }>
      ) => {
        if (!prev.status) {
          return { status: [newStatus] };
        }
        if (prev.status.includes(newStatus)) {
          const updatedStatus: TaskStatus[] = prev.status.filter(
            (s: TaskStatus): boolean => s !== newStatus
          );
          if (updatedStatus.length === 0) {
            return { status: null };
          }
          return { status: updatedStatus };
        }
        return { status: [...prev.status, newStatus] };
      }
    );
  };

  const onAssigneeChange: (newAssigneeId: string) => void = (newAssigneeId) => {
    if (newAssigneeId === "all") {
      setFilters({ assigneeId: null });
      return;
    }
    setFilters(
      (
        prev: Values<{
          projectId: ParserBuilder<string[]>;
          status: ParserBuilder<TaskStatus[]>;
          assigneeId: ParserBuilder<string[]>;
          dueDate: ParserBuilder<string>;
        }>
      ) => {
        if (!prev.assigneeId) {
          return { assigneeId: [newAssigneeId] };
        }
        if (prev.assigneeId.includes(newAssigneeId)) {
          const updatedStatus: string[] = prev.assigneeId.filter(
            (s: string): boolean => s !== newAssigneeId
          );
          if (updatedStatus.length === 0) {
            return { assigneeId: null };
          }
          return { assigneeId: updatedStatus };
        }
        return { assigneeId: [...prev.assigneeId, newAssigneeId] };
      }
    );
  };

  const onProjectChange: (newProjectId: string) => void = (newProjectId) => {
    if (newProjectId === "all") {
      setFilters({ projectId: null });
      return;
    }
    setFilters(
      (
        prev: Values<{
          projectId: ParserBuilder<string[]>;
          status: ParserBuilder<TaskStatus[]>;
          assigneeId: ParserBuilder<string[]>;
          dueDate: ParserBuilder<string>;
        }>
      ) => {
        if (!prev.projectId) {
          return { projectId: [newProjectId] };
        }
        if (prev.projectId.includes(newProjectId)) {
          const updatedStatus: string[] = prev.projectId.filter(
            (s: string): boolean => s !== newProjectId
          );
          if (updatedStatus.length === 0) {
            return { projectId: null };
          }
          return { projectId: updatedStatus };
        }
        return { projectId: [...prev.projectId, newProjectId] };
      }
    );
  };

  if (isLoading) {
    return null;
  }

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
            {status && status.length > 0 && (
              <>
                <Separator
                  orientation="vertical"
                  className="mx-2 h-4"
                />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {status.length}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {status.length > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {status.length} selected
                    </Badge>
                  ) : (
                    taskOptions
                      .filter((option: TaskStatusOption): boolean =>
                        status.includes(option.value)
                      )
                      .map(
                        (option: TaskStatusOption): ReactElement => (
                          <Badge
                            variant="secondary"
                            key={option.value}
                            className="rounded-sm px-1 font-normal"
                          >
                            <div className="mr-2">{option.icon}</div>
                            {option.label}
                          </Badge>
                        )
                      )
                  )}
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
                {taskOptions.map((option: TaskStatusOption): ReactElement => {
                  const isSelected: boolean =
                    status?.includes(option.value) ?? false;
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={(): void => {
                        onStatusChange(option.value as string);
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
              {status && status.length > 0 && (
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
              {assigneeId && assigneeId.length > 0 && (
                <>
                  <Separator
                    orientation="vertical"
                    className="mx-2 h-4"
                  />
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal lg:hidden"
                  >
                    {assigneeId.length}
                  </Badge>
                  <div className="hidden space-x-1 lg:flex">
                    {assigneeId.length > 2 ? (
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {assigneeId.length} selected
                      </Badge>
                    ) : (
                      filteredMembers
                        .filter((option: Member): boolean =>
                          assigneeId.includes(option.$id)
                        )
                        .map(
                          (option: Member, index: number): ReactElement => (
                            <div
                              key={option.$id}
                              className="relative z-[--index] hover:z-[1000]"
                              style={
                                {
                                  marginLeft: index !== 0 ? "-5px" : "0",
                                  "--index":
                                    filteredMembers.filter(
                                      (option: Member): boolean =>
                                        assigneeId.includes(option.$id)
                                    ).length - index,
                                } as CSSProperties
                              }
                            >
                              <MemberAvatar
                                member={option}
                                className="size-6"
                              />
                            </div>
                          )
                        )
                    )}
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
                  {filteredMembers.map((option: Member): ReactElement => {
                    const isSelected: boolean =
                      assigneeId?.includes(option.$id) ?? false;
                    return (
                      <CommandItem
                        key={option.$id}
                        onSelect={(): void => {
                          onAssigneeChange(option.$id);
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
                        <MemberAvatar
                          member={option}
                          className="mb-1.5"
                        />
                        <span>{option.name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {assigneeId && assigneeId.length > 0 && (
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
              {projectId && projectId.length > 0 && (
                <>
                  <Separator
                    orientation="vertical"
                    className="mx-2 h-4"
                  />
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal lg:hidden"
                  >
                    {projectId.length}
                  </Badge>
                  <div className="hidden space-x-1 lg:flex">
                    {projectId.length > 2 ? (
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {projectId.length} selected
                      </Badge>
                    ) : (
                      projectOptions
                        .filter((option: Project): boolean =>
                          projectId.includes(option.$id)
                        )
                        .map(
                          (option: Project): ReactElement => (
                            <Badge
                              variant="secondary"
                              key={option.$id}
                              className="rounded-sm px-1 font-normal"
                            >
                              <ProjectAvatar
                                image={option.imageUrl}
                                name={option.name}
                                className="mr-2"
                              />
                              {option.name}
                            </Badge>
                          )
                        )
                    )}
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
              <CommandInput placeholder="Project" />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {projectOptions.map((option: Project): ReactElement => {
                    const isSelected: boolean =
                      projectId?.includes(option.$id) ?? false;
                    return (
                      <CommandItem
                        key={option.$id}
                        onSelect={(): void => {
                          onProjectChange(option.$id);
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
                        <ProjectAvatar
                          image={option.imageUrl}
                          name={option.name}
                        />
                        <span>{option.name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {projectId && projectId.length > 0 && (
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
        placeholder="Due Date"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date: Date | undefined): Promise<URLSearchParams> =>
          setFilters({ dueDate: date ? date.toISOString() : null })
        }
        className="h-8 w-auto justify-center border-dashed font-semibold text-black dark:text-white"
        showBadge
      />
      {((status && status.length > 0) ||
        (assigneeId && assigneeId.length > 0) ||
        (projectId && projectId.length > 0) ||
        dueDate) && (
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
        </Button>
      )}
    </div>
  );
};
