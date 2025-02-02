"use client";

import { useDeleteProject } from "@/features/projects/api/use-delete-project";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { DatesString, Project } from "@/features/projects/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";
import { RiAddCircleFill } from "react-icons/ri";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
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
        onSuccess: (): void => {
          window.location.href = `/workspaces/${workspaceId}`;
        },
      }
    );
  };

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel className="text-xs text-neutral-500 uppercase">
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
        <SidebarGroupLabel className="text-xs text-neutral-500 uppercase">
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
            {data?.documents.map((project: Project): ReactElement => {
              const href: string = `/workspaces/${workspaceId}/projects/${project.$id}`;
              const isActive: boolean = pathname === href;

              return (
                <HoverCard key={project.$id}>
                  <HoverCardTrigger>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "flex h-8 cursor-pointer items-center gap-2.5 rounded-md text-neutral-500 transition hover:opacity-75",
                          isActive &&
                            "bg-background text-primary shadow-xs hover:opacity-100"
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
                          <DropdownMenuItem
                            asChild
                            disabled={isDeletingProject}
                          >
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
                            disabled={isDeletingProject}
                          >
                            <span>Delete Project</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-[240px]">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">
                          {project.name}
                        </h4>
                        {project.label && (
                          <Badge variant="secondary">{project.label}</Badge>
                        )}
                      </div>
                      <div className="flex items-center pt-2">
                        <span className="text-muted-foreground text-xs">
                          <p className="text-sm text-gray-500">
                            {project.startDate && !project.endDate && (
                              <>
                                Started on{" "}
                                {format(
                                  new Date(project.startDate),
                                  "dd/MM/yyyy"
                                )}
                              </>
                            )}
                            {!project.startDate && project.endDate && (
                              <>
                                Ends on{" "}
                                {format(
                                  new Date(project.endDate),
                                  "dd/MM/yyyy"
                                )}
                              </>
                            )}
                            {project.startDate && project.endDate && (
                              <>
                                {format(
                                  new Date(project.startDate),
                                  "dd/MM/yyyy"
                                )}{" "}
                                {" -> "}{" "}
                                {format(
                                  new Date(project.endDate),
                                  "dd/MM/yyyy"
                                )}
                              </>
                            )}
                          </p>
                        </span>
                      </div>
                      {project.dates?.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <h4 className="text-sm font-semibold">
                            Important Dates
                          </h4>
                          {project.dates?.map(
                            (date: DatesString): ReactElement => (
                              <Badge
                                key={`${date.title}-${new Date(date.date).toISOString()}`}
                                variant="secondary"
                              >
                                {date.title} -{" "}
                                {format(new Date(date.date), "dd/MM/yyyy")}
                              </Badge>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};
