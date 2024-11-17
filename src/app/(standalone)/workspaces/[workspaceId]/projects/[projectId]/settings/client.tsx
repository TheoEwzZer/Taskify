"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { EditProjectFormWrapper } from "@/features/projects/components/edit-project-form-wrapper";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { ReactElement } from "react";

export const ProjectIdSettingsClient: () => ReactElement = () => {
  const projectId: string = useProjectId();
  const { data, isLoading } = useGetProject({ projectId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Failed to fetch project" />;
  }

  return (
    <div className="w-full lg:max-w-2xl">
      <EditProjectFormWrapper initialValues={data} />
    </div>
  );
};
