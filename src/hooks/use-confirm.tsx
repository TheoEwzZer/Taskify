import { ResponsiveModal } from "@/components/responsive-modal";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReactElement, useState } from "react";

export const useConfirm: (
  title: string,
  message: string,
  variant?: ButtonProps["variant"]
) => [() => ReactElement, () => Promise<unknown>] = (
  title: string,
  message: string,
  variant: ButtonProps["variant"] = "primary"
) => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm: () => Promise<boolean> = () => {
    return new Promise<boolean>(
      (resolve: (value: boolean | PromiseLike<boolean>) => void) => {
        setPromise({ resolve });
      }
    );
  };

  const handleClose: () => void = () => {
    setPromise(null);
  };

  const handleConfirm: () => void = () => {
    promise?.resolve(true);
    setPromise(null);
  };

  const handleCancel: () => void = () => {
    promise?.resolve(false);
    setPromise(null);
  };

  const ConfirmationDialog: () => ReactElement = () => (
    <ResponsiveModal
      open={promise != null}
      onOpenChange={handleClose}
    >
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="pt-8">
          <CardHeader className="p-0">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <div className="flex w-full flex-col items-center justify-end gap-x-2 gap-y-2 pt-4 lg:flex-row">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full lg:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant={variant}
              className="w-full lg:w-auto"
            >
              Confirm
            </Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );

  return [ConfirmationDialog, confirm];
};
