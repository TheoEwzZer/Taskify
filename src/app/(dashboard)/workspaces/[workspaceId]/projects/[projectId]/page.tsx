import { Button } from "@/components/ui/button";
import { getCurrent } from "@/features/auth/queries";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { getProject } from "@/features/projects/queries";
import { Project } from "@/features/projects/types";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Models } from "node-appwrite";
import { ReactElement } from "react";

interface ProjectIdPageProps {
  params: { projectId: string };
}

export default async function ProjectIdPage({
  params,
}: Readonly<ProjectIdPageProps>): Promise<ReactElement> {
  const user: Models.User<Models.Preferences> | null = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }

  const initialValues: Project = await getProject({
    projectId: params.projectId,
  });

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={initialValues?.name}
            image={initialValues?.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{initialValues?.name}</p>
        </div>
        <div>
          <Button
            variant="secondary"
            size="sm"
            asChild
          >
            <Link
              href={`/workspaces/${initialValues?.workspaceId}/projects/${initialValues?.$id}/settings`}
            >
              <PencilIcon />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
}
