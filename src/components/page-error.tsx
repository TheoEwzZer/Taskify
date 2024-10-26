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
      <AlertTriangle className="mb-2 size-6 text-muted-foreground" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
};
