import { Card, CardContent } from "@/components/ui/card";
import { useGetLabel } from "@/features/members/api/use-get-label";
import { useGetMembers } from "@/features/members/api/use-get-member";
import { Member } from "@/features/members/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { ReactElement } from "react";
import { CreateProjectForm } from "./create-project-form";

interface CreateProjectFormWrapperProps {
  onCancel: () => void;
}

export const CreateProjectFormWrapper: (
  props: CreateProjectFormWrapperProps
) => ReactElement = ({ onCancel }: CreateProjectFormWrapperProps) => {
  const workspaceId: string = useWorkspaceId();

  const { data: members, isLoading } = useGetMembers({
    workspaceId,
  });

  const { data: labels, isLoading: isLoadingLabels } = useGetLabel({
    workspaceId,
  });

  const memberOptions: Member[] | undefined = members?.documents;

  const labelOptions: string[] | undefined = labels?.labels;

  if (isLoading || isLoadingLabels) {
    return (
      <Card className="h-[714px] w-full border-none shadow-none">
        <CardContent className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateProjectForm
      onCancel={onCancel}
      memberOptions={memberOptions ?? []}
      labelOptions={labelOptions ?? []}
    />
  );
};
