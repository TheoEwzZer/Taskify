"use client";

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ChevronsUpDown, Plus } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { Models } from "node-appwrite";
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

  const currentWorkspace: Models.Document | undefined =
    workspaces?.documents.find(
      (workspace: Models.Document): boolean => workspace.$id === workspaceId
    );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="bg-neutral-200 p-1 hover:bg-neutral-200 active:bg-neutral-200 data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary/10 text-sidebar-primary-foreground">
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
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspaces
            </DropdownMenuLabel>
            {workspaces?.documents.map(
              (workspace: Models.Document): ReactElement => (
                <DropdownMenuItem
                  key={workspace.$id}
                  onClick={(): void => onSelect(workspace.$id)}
                  className="cursor-pointer gap-2 p-2"
                >
                  <div className="flex items-center justify-center rounded-sm border">
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
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-5 text-neutral-500 transition" />
              </div>
              <div className="font-medium text-muted-foreground">
                Create Workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
