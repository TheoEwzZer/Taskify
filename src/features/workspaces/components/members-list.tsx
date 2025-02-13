"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useGetMembers } from "@/features/members/api/use-get-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { Member, MemberRole } from "@/features/members/types";
import { useConfirm } from "@/hooks/use-confirm";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { Fragment, ReactElement } from "react";
import { useGetWorkspace } from "../api/use-get-workspace";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { InviteMembersCard } from "./invite-members-card";

export const Memberslist: () => ReactElement = () => {
  const workspaceId: string = useWorkspaceId();
  const [ConfimDialog, confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the workspace.",
    "destructive"
  );

  const { data } = useGetMembers({ workspaceId });
  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { data: workspaceData } = useGetWorkspace({ workspaceId });

  const handleUpdateMember: (memberId: string, role: MemberRole) => void = (
    memberId: string,
    role: MemberRole
  ) => {
    updateMember({
      json: { role },
      param: { memberId },
    });
  };

  const handleDeleteMember: (memberId: string) => Promise<void> = async (
    memberId: string
  ) => {
    const ok: unknown = await confirm();

    if (!ok) {
      return;
    }

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: (): void => {
          window.location.reload();
        },
      }
    );
  };

  return (
    <Card className="h-full w-full border-none shadow-none">
      <ConfimDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
        <Button
          asChild
          variant="secondary"
          size="sm"
        >
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members list</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {data?.documents.map(
          (member: Member, index: number): ReactElement => (
            <Fragment key={member.$id}>
              <div className="flex flex-row items-center gap-x-4">
                <MemberAvatar
                  className="size-10"
                  fallbackClassName="text-lg"
                  member={member}
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {member.email}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="ml-auto"
                      variant="secondary"
                      size="icon"
                    >
                      <MoreVerticalIcon className="text-muted-foreground size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                  >
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() => {
                        handleUpdateMember(member.$id, MemberRole.ADMIN);
                      }}
                      disabled={isUpdatingMember}
                    >
                      Set as Administator
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() => {
                        handleUpdateMember(member.$id, MemberRole.MEMBER);
                      }}
                      disabled={isUpdatingMember}
                    >
                      Set as Member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="font-medium text-amber-700"
                      onClick={() => {
                        handleDeleteMember(member.$id);
                      }}
                      disabled={isDeletingMember}
                    >
                      Remove {member.name}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {index < data.documents.length - 1 && (
                <Separator className="my-2.5" />
              )}
            </Fragment>
          )
        )}
      </CardContent>
      {workspaceData && <InviteMembersCard workspace={workspaceData} />}
    </Card>
  );
};
