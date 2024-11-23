"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ReactElement } from "react";
import { Task } from "../../types";
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
    cell: ({ row }: CellContext<Task, unknown>): ReactElement => {
      const { status } = row.original;

      return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>;
    },
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
