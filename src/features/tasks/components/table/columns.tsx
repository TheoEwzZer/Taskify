"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { snakeCaseToTitleCase } from "@/lib/utils";
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
      const { assignee } = row.original;

      if (!assignee) {
        return (
          <div className="flex items-center gap-x-2 text-sm font-medium">
            <XIcon className="size-6 rounded-full border border-neutral-300 transition" />
            <p className="line-clamp-1">Unassigned</p>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <MemberAvatar
            className="size-6"
            fallbackClassName="text-xs"
            member={assignee}
          />
          <p className="line-clamp-1">{assignee.name}</p>
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
