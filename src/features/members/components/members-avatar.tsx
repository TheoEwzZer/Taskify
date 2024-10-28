import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ReactElement } from "react";
import { Member } from "../types";

interface MemberAvatarProps {
  member: Member;
  className?: string;
  fallbackClassName?: string;
}

export const MemberAvatar: ({
  member,
  className,
  fallbackClassName,
}: MemberAvatarProps) => ReactElement = ({
  member,
  className,
  fallbackClassName,
}: MemberAvatarProps) => {
  return (
    <Avatar
      className={cn(
        "size-5 rounded-full border border-neutral-300 transition",
        className
      )}
    >
      {member.avatar && member.avatar != "none" && (
        <AvatarImage
          src={member.avatar}
          alt={member.name}
        />
      )}
      <AvatarFallback
        className={cn(
          "flex items-center justify-center bg-neutral-200 font-medium text-neutral-500",
          fallbackClassName
        )}
      >
        {member.name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
