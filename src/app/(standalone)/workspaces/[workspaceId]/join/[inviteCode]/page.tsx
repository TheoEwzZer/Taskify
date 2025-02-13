import { getCurrent } from "@/features/auth/queries";
import { Models } from "node-appwrite";
import { ReactElement } from "react";
import { WorkspaceIdJoinClient } from "./client";

const WorkspaceIdJoinPage: () => Promise<ReactElement> = async () => {
  const user: Models.User<Models.Preferences> | null = await getCurrent();

  return <WorkspaceIdJoinClient user={user} />;
};

export default WorkspaceIdJoinPage;
