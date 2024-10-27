"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ReactElement } from "react";

export const WorkspaceIdSettingsClient: () => ReactElement = () => {
  const workspaceId: string = useWorkspaceId();
  const { data, isLoading } = useGetWorkspace({ workspaceId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Failed to fetch workspace" />;
  }

  return (
    <div className="w-full lg:max-w-2xl">
      <EditWorkspaceForm initialValues={data} />
    </div>
  );
};
