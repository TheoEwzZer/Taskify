import { Column } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowDownIcon,
  ArrowUp,
  ArrowUpDown,
  ArrowUpIcon,
  EyeOff,
} from "lucide-react";
import { ReactElement } from "react";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: Readonly<DataTableColumnHeaderProps<TData, TValue>>): ReactElement {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const getSortIcon: (column: Column<TData, TValue>) => ReactElement = (
    column
  ) => {
    if (column.getIsSorted() === "desc") {
      return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    if (column.getIsSorted() === "asc") {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {getSortIcon(column)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={(): void => column.toggleSorting(false)}>
            <ArrowUpIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(): void => column.toggleSorting(true)}>
            <ArrowDownIcon className="h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(): void => column.toggleVisibility(false)}
              >
                <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
