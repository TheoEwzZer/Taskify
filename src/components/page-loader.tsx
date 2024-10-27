import { Loader } from "lucide-react";
import { ReactElement } from "react";

export const PageLoader: () => ReactElement = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};
