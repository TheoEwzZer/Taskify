import { getCurrent } from "@/features/auth/queries";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { getWorkspace } from "@/features/workspaces/queries";
import { Workspace } from "@/features/workspaces/types";
import { redirect } from "next/navigation";
import { Models } from "node-appwrite";
import { ReactElement } from "react";

interface WorkspaceIdSettingsPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceSettingsPage: ({
  params,
}: WorkspaceIdSettingsPageProps) => Promise<ReactElement> = async ({
  params,
}: WorkspaceIdSettingsPageProps) => {
  const user: Models.User<Models.Preferences> | null = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }

  const initialValues: Workspace = await getWorkspace({
    workspaceId: params.workspaceId,
  });

  return (
    <div className="w-full md:max-w-2xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorkspaceSettingsPage;
