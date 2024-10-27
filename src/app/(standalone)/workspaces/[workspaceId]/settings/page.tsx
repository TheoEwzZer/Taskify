import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { Models } from "node-appwrite";
import { ReactElement } from "react";
import { WorkspaceIdSettingsClient } from "./client";

const WorkspaceSettingsPage: () => Promise<ReactElement> = async () => {
  const user: Models.User<Models.Preferences> | null = await getCurrent();

  if (!user) {
    redirect("/sign-in");
  }

  return <WorkspaceIdSettingsClient />;
};

export default WorkspaceSettingsPage;
