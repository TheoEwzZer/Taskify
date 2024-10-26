import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { Models } from "node-appwrite";
import { getMember } from "../members/util";
import { Project } from "./types";

interface GetProjectProps {
  projectId: string;
}

export const getProject: ({
  projectId,
}: GetProjectProps) => Promise<Project> = async ({
  projectId,
}: GetProjectProps) => {
  const { databases, account } = await createSessionClient();

  const user: Models.User<Models.Preferences> = await account.get();

  const project: Project = await databases.getDocument<Project>(
    DATABASE_ID,
    PROJECTS_ID,
    projectId
  );

  const member: Models.Document = await getMember({
    databases,
    userId: user.$id,
    workspaceId: project.workspaceId,
  });

  if (!member) {
    throw new Error("Unauthorized");
  }

  return project;
};
