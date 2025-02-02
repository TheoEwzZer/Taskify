"use client";

import { AlertTriangle } from "lucide-react";
import { ReactElement } from "react";

interface PageErrorProps {
  message?: string;
}

export const PageError: ({ message }: PageErrorProps) => ReactElement = ({
  message = "Someting went wrong",
}) => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <AlertTriangle className="text-muted-foreground mb-2 size-6" />
      <p className="text-muted-foreground text-sm font-medium">{message}</p>
    </div>
  );
};
