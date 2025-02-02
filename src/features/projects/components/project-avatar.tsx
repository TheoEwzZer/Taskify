import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ReactElement } from "react";

interface ProjectAvatarProps {
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const ProjectAvatar: ({
  name,
  className,
  fallbackClassName,
}: ProjectAvatarProps) => ReactElement = ({
  name,
  className,
  fallbackClassName,
}: ProjectAvatarProps) => {
  return (
    <Avatar className={cn("size-5 rounded-md", className)}>
      <AvatarFallback
        className={cn(
          "rounded-md bg-blue-600 text-sm font-semibold text-white uppercase",
          fallbackClassName
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
