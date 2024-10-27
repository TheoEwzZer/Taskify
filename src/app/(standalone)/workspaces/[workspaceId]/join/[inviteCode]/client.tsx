"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ReactElement } from "react";

export const WorkspaceIdJoinClient: () => ReactElement = () => {
  const workspaceId: string = useWorkspaceId();
  const { data, isLoading } = useGetWorkspaceInfo({ workspaceId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Failed to fetch workspace" />;
  }

  return (
    <div className="w-full lg:max-w-2xl">
      <JoinWorkspaceForm initialValues={data} />
    </div>
  );
};
