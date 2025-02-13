"use client";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Workspace } from "@/features/workspaces/types";
import { ChevronsUpDown, Plus } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export const WorkspaceSwitcher: () => ReactElement = () => {
  const workspaceId: string = useWorkspaceId();
  const router: AppRouterInstance = useRouter();
  const { data: workspaces } = useGetWorkspaces();
  const { open } = useCreateWorkspaceModal();

  const onSelect: (workspaceId: string) => void = (workspaceId: string) => {
    router.push(`/workspaces/${workspaceId}`);
  };

  const currentWorkspace: Workspace | undefined = workspaces?.documents.find(
    (workspace: Workspace): boolean => workspace.$id === workspaceId
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:text-sidebar-accent-foreground bg-neutral-800 hover:bg-neutral-800 active:bg-neutral-800"
            >
              <div className="bg-primary/10 text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg">
                {currentWorkspace && (
                  <WorkspaceAvatar
                    name={currentWorkspace.name}
                    image={currentWorkspace.imageUrl}
                  />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentWorkspace?.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>
            {workspaces?.documents.map(
              (workspace: Workspace): ReactElement => (
                <DropdownMenuItem
                  key={workspace.$id}
                  onClick={(): void => onSelect(workspace.$id)}
                  className="cursor-pointer gap-2 p-2"
                >
                  <div className="flex size-10 items-center justify-center rounded-md border">
                    <WorkspaceAvatar
                      name={workspace.name}
                      image={workspace.imageUrl}
                    />
                  </div>
                  {workspace.name}
                </DropdownMenuItem>
              )
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2 p-2"
              onClick={open}
            >
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-5 text-neutral-500 transition" />
              </div>
              <div className="text-muted-foreground font-medium">
                Create Workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
