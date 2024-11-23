"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { redirect, usePathname } from "next/navigation";
import { Models } from "node-appwrite";
import { ReactElement, useEffect } from "react";

interface WorkspaceIdJoinClientProps {
  user: Models.User<Models.Preferences> | null;
}

export const WorkspaceIdJoinClient: ({
  user,
}: WorkspaceIdJoinClientProps) => ReactElement = ({
  user,
}: WorkspaceIdJoinClientProps) => {
  const pathname: string = usePathname();

  useEffect(() => {
    if (!user) {
      document.cookie = `redirectUrl=${pathname}; path=/;`;
      redirect("/sign-in");
    }
  }, [user, pathname]);

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
