import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Avatar
            className={cn(
              "mt-1.5 size-5 rounded-full border border-neutral-700 transition",
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
        </TooltipTrigger>
        <TooltipContent>
          <p>{member.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface MemberAvatarOtherProps {
  members: Member[];
  className?: string;
  fallbackClassName?: string;
  maxMembers: number;
}

export const MemberAvatarOther: ({
  members,
  className,
  fallbackClassName,
  maxMembers,
}: MemberAvatarOtherProps) => ReactElement = ({
  members,
  className,
  fallbackClassName,
  maxMembers,
}: MemberAvatarOtherProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Avatar
            className={cn(
              "mt-1.5 size-5 rounded-full border border-neutral-300 transition",
              className
            )}
          >
            <AvatarFallback
              className={cn(
                "flex items-center justify-center bg-neutral-200 font-medium text-neutral-500",
                fallbackClassName
              )}
            >
              +{members.length - maxMembers}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          {members.slice(maxMembers).map(
            (assignee: Member): ReactElement => (
              <p key={assignee.$id}>{assignee.name}</p>
            )
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
