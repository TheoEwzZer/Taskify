import { Loader } from "lucide-react";
import { ReactElement } from "react";

export const PageLoader: () => ReactElement = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Loader className="text-muted-foreground size-6 animate-spin" />
    </div>
  );
};
