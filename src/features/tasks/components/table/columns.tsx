"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MemberAvatar,
  MemberAvatarOther,
} from "@/features/members/components/members-avatar";
import { Member } from "@/features/members/types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import { CellContext, ColumnDef, HeaderContext } from "@tanstack/react-table";
import { MoreVertical, XIcon } from "lucide-react";
import { ReactElement, useState } from "react";
import { useUpdateTask } from "../../api/use-update-task";
import { Task, TaskStatus } from "../../types";
import { taskOptions, TaskStatusOption } from "../data-filters";
import { TaskActions } from "../task-actions";
import { TaskDate } from "../task-date";
import { DataTableColumnHeader } from "./data-table-column-header";

const dateSort: (rowA: any, rowB: any, columnId: string) => number = (
  rowA,
  rowB,
  columnId
) => {
  const dateA = new Date(rowA.original[columnId]);
  const dateB = new Date(rowB.original[columnId]);
  return dateA.getTime() - dateB.getTime();
};

const StatusCell = ({
  row,
}: {
  row: CellContext<Task, unknown>["row"];
}): ReactElement => {
  const { status, $id } = row.original;
  const [open, setOpen] = useState(false);
  const { mutate } = useUpdateTask();

  const onStatusChange = (value: TaskStatus): void => {
    mutate({
      json: {
        status: value,
      },
      param: { taskId: $id },
    });
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <div>
          <Badge
            variant={status}
            className="cursor-pointer"
          >
            {snakeCaseToTitleCase(status)}
          </Badge>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Status" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {taskOptions.map((option: TaskStatusOption): ReactElement => {
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={(): void => {
                      onStatusChange(option.value);
                      setOpen(false);
                    }}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }: HeaderContext<Task, unknown>): ReactElement => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: CheckedState): void =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }: CellContext<Task, unknown>): ReactElement => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: CheckedState): void =>
          row.toggleSelected(!!value)
        }
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    enableHiding: false,
    header: ({ column }: HeaderContext<Task, unknown>): ReactElement => (
      <DataTableColumnHeader
        column={column}
        title="Task Name"
      />
    ),
    cell: ({ row }: CellContext<Task, unknown>): ReactElement => {
      const { name } = row.original;

      return <p className="line-clamp-1">{name}</p>;
    },
  },
  {
    accessorKey: "project",
    header: ({ column }: HeaderContext<Task, unknown>): ReactElement => (
      <DataTableColumnHeader
        column={column}
        title="Project"
      />
    ),
    cell: ({ row }: CellContext<Task, unknown>): ReactElement => {
      const { project } = row.original;

      if (!project) {
        return <p className="line-clamp-1">No Project</p>;
      }

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <ProjectAvatar
            className="size-6"
            name={project.name}
            image={project.imageUrl}
          />
          <p className="line-clamp-1">{project.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "assignee",
    header: ({ column }: HeaderContext<Task, unknown>): ReactElement => (
      <DataTableColumnHeader
        column={column}
        title="Assignee"
      />
    ),
    cell: ({ row }: CellContext<Task, unknown>): ReactElement => {
      const { assignees } = row.original;

      if (!assignees || assignees.length === 0) {
        return (
          <div className="flex items-center gap-x-2 text-sm font-medium">
            <XIcon className="size-6 rounded-full border border-neutral-300 transition" />
            <p className="line-clamp-1">Unassigned</p>
          </div>
        );
      }

      return (
        <div className="flex items-start gap-y-2 text-sm font-medium">
          {assignees.slice(0, 4).map(
            (assignee: Member, index: number): ReactElement => (
              <div
                key={assignee.$id}
                className="relative"
                style={{
                  marginLeft: index !== 0 ? "-5px" : "0",
                  zIndex: assignees.length - index,
                }}
              >
                <MemberAvatar
                  member={assignee}
                  className="size-6"
                />
              </div>
            )
          )}
          {assignees.length > 4 && (
            <div
              className="relative"
              style={{
                marginLeft: "-5px",
                zIndex: 0,
              }}
            >
              <MemberAvatarOther
                members={assignees}
                maxMembers={4}
                className="mt-1.5 size-6"
                fallbackClassName="text-[10px]"
              />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }: HeaderContext<Task, unknown>): ReactElement => (
      <DataTableColumnHeader
        column={column}
        title="Due Date"
      />
    ),
    cell: ({ row }: CellContext<Task, unknown>): ReactElement => {
      const { dueDate } = row.original;

      return <TaskDate value={dueDate} />;
    },
    sortingFn: dateSort,
  },
  {
    accessorKey: "status",
    header: ({ column }: HeaderContext<Task, unknown>): ReactElement => (
      <DataTableColumnHeader
        column={column}
        title="Status"
      />
    ),
    cell: ({ row }: CellContext<Task, unknown>): ReactElement => (
      <StatusCell row={row} />
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }: CellContext<Task, unknown>): ReactElement => {
      const id: string = row.original.$id;
      const { projectId } = row.original;

      return (
        <TaskActions
          id={id}
          projectId={projectId}
        >
          <Button
            variant="ghost"
            className="size-8 p-0"
          >
            <MoreVertical className="size-4" />
          </Button>
        </TaskActions>
      );
    },
  },
];
