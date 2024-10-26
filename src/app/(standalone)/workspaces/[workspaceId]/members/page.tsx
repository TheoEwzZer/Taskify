import { getCurrent } from "@/features/auth/queries";
import { Memberslist } from "@/features/workspaces/components/members-list";
import { redirect } from "next/navigation";
import { Models } from "node-appwrite";
import { ReactElement } from "react";

const WorkspaceIdMembersProps: () => Promise<ReactElement> = async () => {
  const user: Models.User<Models.Preferences> | null = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full lg:max-w-2xl">
      <Memberslist />
    </div>
  );
};

export default WorkspaceIdMembersProps;
