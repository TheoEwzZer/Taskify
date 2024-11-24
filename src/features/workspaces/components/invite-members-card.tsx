"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { CopyIcon } from "lucide-react";
import { ReactElement } from "react";
import { toast } from "sonner";
import { useResetInviteCode } from "../api/use-reset-invite-code";
import { Workspace } from "../types";

interface InviteMembersCardProps {
  workspace: Workspace;
}

export const InviteMembersCard: ({
  workspace,
}: InviteMembersCardProps) => ReactElement = ({ workspace }) => {
  const [ResetDialog, confirmResetInviteCode] = useConfirm(
    "Reset Invite Code",
    "This action will invalidate the current invite code.",
    "destructive"
  );

  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();

  const handleResetInviteCode: () => Promise<void> = async () => {
    const ok = await confirmResetInviteCode();

    if (!ok) {
      return;
    }

    resetInviteCode({ param: { workspaceId: workspace.$id } });
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${workspace.$id}/join/${workspace.inviteCode}`;

  const handleCopyInviteLink: () => Promise<void> = async () => {
    try {
      await navigator.clipboard.writeText(fullInviteLink);
      toast.success("Invite link copied to clipboard");
    } catch {
      toast.error("Error copying invite link");
    }
  };

  return (
    <>
      <ResetDialog />
      <Card className="h-full w-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Invite Members</h3>
            <p className="text-sm text-muted-foreground">
              Use the invite link to add members to your workspace.
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <Input
                  disabled
                  value={fullInviteLink}
                />
                <Button
                  onClick={handleCopyInviteLink}
                  variant="secondary"
                  className="size-12"
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              className="ml-auto mt-6 w-fit"
              size="sm"
              variant="destructive"
              type="button"
              disabled={isResettingInviteCode}
              onClick={handleResetInviteCode}
            >
              Reset invite link
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
