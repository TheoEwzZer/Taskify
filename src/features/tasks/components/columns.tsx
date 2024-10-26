"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { CellContext, ColumnDef, HeaderContext } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { ReactElement } from "react";
import { Task } from "../types";
import { TaskActions } from "./task-actions";
import { TaskDate } from "./task-date";

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
    header: ({ column }: HeaderContext<Task, unknown>): ReactElement => {
      return (
        <Button
          variant="ghost"
          onClick={(): void =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Task Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: CellContext<Task, unknown>): ReactElement => {
      const { name } = row.original;

      return <p className="line-clamp-1">{name}</p>;
    },
  },
  {
    accessorKey: "project",
    header: ({ column }: HeaderContext<Task, unknown>): ReactElement => {
      return (
        <Button
          variant="ghost"
          onClick={(): void =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Project
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    header: ({ column }: HeaderContext<Task, unknown>): ReactElement => {
      return (
        <Button
          variant="ghost"
          onClick={(): void =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Assignee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: CellContext<Task, unknown>): ReactElement => {
      const { assignee } = row.original;

      if (!assignee) {
        return <p className="line-clamp-1">Unassigned</p>;
      }

      return (
        <div className="flex items-center gap-x-2 text-sm font-medium">
          <MemberAvatar
            className="size-6"
            fallbackClassName="text-xs"
            name={assignee.name}
          />
          <p className="line-clamp-1">{assignee.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }: HeaderContext<Task, unknown>): ReactElement => {
      return (
        <Button
          variant="ghost"
          onClick={(): void =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: CellContext<Task, unknown>): ReactElement => {
      const { dueDate } = row.original;

      return <TaskDate value={dueDate} />;
    },
    sortingFn: dateSort,
  },
  {
    accessorKey: "status",
    header: ({ column }: HeaderContext<Task, unknown>): ReactElement => {
      return (
        <Button
          variant="ghost"
          onClick={(): void =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: CellContext<Task, unknown>): ReactElement => {
      const { status } = row.original;

      return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>;
    },
  },
  {
    id: "actions",
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
