import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-member";
import { Member } from "@/features/members/types";
import { Project } from "@/features/projects/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { ReactElement } from "react";
import { EditProjectForm } from "./edit-project-form";

interface EditProjectFormWrapperProps {
  onCancel?: () => void;
  initialValues: Project;
}

export const EditProjectFormWrapper: (
  props: EditProjectFormWrapperProps
) => ReactElement = ({
  onCancel,
  initialValues,
}: EditProjectFormWrapperProps) => {
  const workspaceId: string = useWorkspaceId();

  const { data: members, isLoading } = useGetMembers({
    workspaceId,
  });

  const memberOptions: Member[] | undefined = members?.documents;

  if (isLoading) {
    return (
      <Card className="h-[714px] w-full border-none shadow-none">
        <CardContent className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  console.log("initialValues", initialValues);

  return (
    <EditProjectForm
      onCancel={onCancel}
      initialValues={initialValues}
      memberOptions={memberOptions ?? []}
    />
  );
};
