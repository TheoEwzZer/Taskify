"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useInviteCode } from "../hooks/use-invite-code";
import { useWorkspaceId } from "../hooks/use-workspace-id";

interface JoinWorkspaceFormProps {
  initialValues: {
    name: string;
  };
}

export const JoinWorkspaceForm: ({
  initialValues,
}: JoinWorkspaceFormProps) => ReactElement = ({
  initialValues,
}: JoinWorkspaceFormProps) => {
  const router: AppRouterInstance = useRouter();
  const workspaceId: string = useWorkspaceId();
  const inviteCode: string = useInviteCode();
  const { mutate, isPending } = useJoinWorkspace();

  const onSubmit: () => void = () => {
    mutate(
      {
        param: {
          workspaceId,
        },
        json: {
          code: inviteCode,
        },
      },
      {
        onSuccess: ({ data }: { data: { $id: string } }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join workspace</CardTitle>
        <CardDescription>
          You've been invited to join <strong>{initialValues.name}</strong>{" "}
          workspace
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
          <Button
            className="w-full md:w-fit"
            variant="secondary"
            type="button"
            asChild
            size="lg"
            disabled={isPending}
          >
            <Link href="/">Cancel</Link>
          </Button>
          <Button
            className="w-full md:w-fit"
            type="button"
            size="lg"
            onClick={onSubmit}
            disabled={isPending}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
