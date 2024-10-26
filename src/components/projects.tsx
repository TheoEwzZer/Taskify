"use client";

import { useDeleteProject } from "@/features/projects/api/use-delete-project";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";
import { RiAddCircleFill } from "react-icons/ri";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "./ui/sidebar";

export const Projects: () => ReactElement = () => {
  const workspaceId: string = useWorkspaceId();
  const { data, isLoading } = useGetProjects({ workspaceId });
  const pathname: string = usePathname();
  const { open } = useCreateProjectModal();
  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Project",
    "This action cannot be undone.",
    "destructive"
  );

  const handleDelete: (projectId: string) => Promise<void> = async (
    projectId: string
  ) => {
    const ok: unknown = await confirmDelete();

    if (!ok) {
      return;
    }

    deleteProject(
      { param: { projectId: projectId } },
      {
        onSuccess: () => {
          window.location.href = `/workspaces/${workspaceId}`;
        },
      }
    );
  };

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel className="text-xs uppercase text-neutral-500">
          Projects
        </SidebarGroupLabel>
        <SidebarGroupAction title="Add Project">
          <RiAddCircleFill className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75" />
          <span className="sr-only">Add Project</span>
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu>
            {Array.from({ length: 5 }).map(
              (_: unknown, index: number): ReactElement => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <>
      <DeleteDialog />
      <SidebarGroup>
        <SidebarGroupLabel className="text-xs uppercase text-neutral-500">
          Projects
        </SidebarGroupLabel>
        <SidebarGroupAction
          title="Add Project"
          onClick={open}
        >
          <RiAddCircleFill className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75" />
          <span className="sr-only">Add Project</span>
        </SidebarGroupAction>
        <SidebarGroupContent>
          <SidebarMenu>
            {data?.documents.map(
              (project: {
                [x: string]: any;
                $id: string;
                $collectionId: string;
                $databaseId: string;
                $createdAt: string;
                $updatedAt: string;
                $permissions: string[];
              }) => {
                const href: string = `/workspaces/${workspaceId}/projects/${project.$id}`;
                const isActive: boolean = pathname === href;

                return (
                  <SidebarMenuItem key={project.$id}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "flex h-8 cursor-pointer items-center gap-2.5 rounded-md text-neutral-500 transition hover:opacity-75",
                        isActive &&
                          "bg-white text-primary shadow-sm hover:opacity-100"
                      )}
                    >
                      <Link href={href}>
                        <ProjectAvatar
                          image={project.imageUrl}
                          name={project.name}
                        />
                        <span className="truncate">{project.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="right"
                        align="start"
                      >
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/workspaces/${workspaceId}/projects/${project.$id}/settings`}
                          >
                            Edit Project
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(): Promise<void> =>
                            handleDelete(project.$id)
                          }
                        >
                          <span>Delete Project</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                );
              }
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};
