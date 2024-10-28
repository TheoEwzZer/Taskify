import { Card, CardContent } from "@/components/ui/card";
import { useCurrent } from "@/features/auth/api/use-current";
import { Loader } from "lucide-react";
import { ReactElement } from "react";
import { EditProfilForm } from "./edit-profil-form";

interface EditProfilFormWrapperProps {
  onCancel: () => void;
}

export const EditProfilFormWrapper: ({
  onCancel,
}: EditProfilFormWrapperProps) => ReactElement | null = ({ onCancel }) => {
  const { data: initialValues, isLoading } = useCurrent();

  if (isLoading) {
    return (
      <Card className="h-[714px] w-full border-none shadow-none">
        <CardContent className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) {
    return null;
  }

  return (
    <EditProfilForm
      initialValues={initialValues}
      onCancel={onCancel}
    />
  );
};
