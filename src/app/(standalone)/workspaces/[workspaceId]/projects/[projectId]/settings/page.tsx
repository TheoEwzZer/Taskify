import { getCurrent } from "@/features/auth/queries";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { getProject } from "@/features/projects/queries";
import { Project } from "@/features/projects/types";
import { redirect } from "next/navigation";
import { Models } from "node-appwrite";
import { ReactElement } from "react";

interface ProjectIdPageSettingsProps {
  params: { projectId: string };
}

export default async function ProjectIdSettingsPage({
  params,
}: Readonly<ProjectIdPageSettingsProps>): Promise<ReactElement> {
  const user: Models.User<Models.Preferences> | null = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }

  const initialValues: Project = await getProject({
    projectId: params.projectId,
  });

  return (
    <div className="w-full lg:max-w-2xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
}
