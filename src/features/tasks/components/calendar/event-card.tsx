import {
  MemberAvatar,
  MemberAvatarOther,
} from "@/features/members/components/members-avatar";
import { Member } from "@/features/members/types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Project } from "@/features/projects/types";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import { TaskStatus } from "../../types";

interface EventCardProps {
  title: string;
  project: Project | undefined;
  assignees: Member[];
  status: TaskStatus;
  id: string;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-l-pink-500",
  [TaskStatus.TODO]: "border-l-red-500",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
  [TaskStatus.IN_REVIEW]: "border-l-blue-500",
  [TaskStatus.DONE]: "border-l-emerald-500",
};

export const EventCard: ({
  title,
  project,
  assignees,
  status,
  id,
}: EventCardProps) => ReactElement = ({
  title,
  project,
  assignees,
  status,
  id,
}) => {
  const workspaceId: string = useWorkspaceId();
  const router: AppRouterInstance = useRouter();

  const onClick: (e: React.MouseEvent<HTMLDivElement>) => void = (e) => {
    e.preventDefault();
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void = (
    e
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(`/workspaces/${workspaceId}/tasks/${id}`);
    }
  };

  return (
    <div className="px-2">
      <div
        role="button"
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className={cn(
          "flex cursor-pointer flex-col gap-y-1.5 rounded-md border border-l-4 bg-white p-1.5 text-xs text-primary transition hover:opacity-75",
          statusColorMap[status]
        )}
      >
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          <div className="flex items-center">
            {assignees.length > 0 && (
              <div className="flex items-center gap-x-1">
                {assignees.slice(0, 4).map(
                  (assignee: Member, index: number): ReactElement => (
                    <div
                      key={assignee.$id}
                      className="relative"
                      style={{
                        marginLeft: index !== 0 ? "-10px" : "0",
                        zIndex: assignees.length - index,
                      }}
                    >
                      <MemberAvatar
                        member={assignee}
                        className="size-6"
                        fallbackClassName="text-[10px]"
                      />
                    </div>
                  )
                )}
                {assignees.length > 4 && (
                  <div
                    className="relative"
                    style={{
                      marginLeft: "-10px",
                      zIndex: 0,
                    }}
                  >
                    <MemberAvatarOther
                      members={assignees}
                      maxMembers={4}
                      className="mt-1 size-6"
                      fallbackClassName="text-[10px]"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          {project && (
            <>
              <div className="size-1 rounded-full bg-neutral-300" />
              <ProjectAvatar
                name={project?.name}
                image={project?.imageUrl}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
