import { getCurrent } from "@/features/auth/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";
import { Models } from "node-appwrite";
import { ReactElement } from "react";

interface WorkspaceIdJoinPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceIdJoinPage: ({
  params,
}: WorkspaceIdJoinPageProps) => Promise<ReactElement> = async ({
  params,
}: WorkspaceIdJoinPageProps) => {
  const user: Models.User<Models.Preferences> | null = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }

  const initialValues: {
    name: string;
  } | null = await getWorkspaceInfo({ workspaceId: params.workspaceId });

  if (!initialValues) {
    redirect("/");
  }

  return (
    <div className="w-full md:max-w-2xl">
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorkspaceIdJoinPage;
