"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { Row, Table } from "@tanstack/react-table";
import { TrashIcon } from "lucide-react";
import { ChangeEvent, ReactElement } from "react";
import { useBulkDeleteTasks } from "../../api/use-bulk-delete-tasks";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: Readonly<DataTableToolbarProps<TData>>): ReactElement {
  const [ConfimDialog, confirm] = useConfirm(
    "Remove selected tasks",
    "This action cannot be undone.",
    "destructive"
  );
  const { mutate, isPending } = useBulkDeleteTasks();

  const onDelete: () => Promise<void> = async () => {
    const ok: unknown = await confirm();

    if (!ok) {
      return;
    }

    const selectedRows: Row<TData>[] = table.getSelectedRowModel().rows;
    const tasksToDelete: { param: { taskId: string } }[] = selectedRows.map(
      (row: Row<TData>) => ({
        param: { taskId: (row.original as { $id: string }).$id },
      })
    );

    mutate(tasksToDelete);
  };

  return (
    <div className="flex items-center justify-between">
      <ConfimDialog />
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event: ChangeEvent<HTMLInputElement>): void | undefined =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getSelectedRowModel().rows.length > 0 && (
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isPending}
            size="sm"
          >
            <TrashIcon className="stroke-2" />
            Delete Selected
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
