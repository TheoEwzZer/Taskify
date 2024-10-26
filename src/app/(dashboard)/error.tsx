"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { ReactElement } from "react";

const ErrorPage: () => ReactElement = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-2">
      <AlertTriangle className="size-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Someting went wrong</p>
      <Button
        variant="secondary"
        size="sm"
      >
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
