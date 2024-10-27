import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { Models, Query } from "node-appwrite";
import { Member } from "../members/types";
import { Workspace } from "./types";

export const getWorkspaces: () => Promise<
  Models.DocumentList<Workspace>
> = async () => {
  const { databases, account } = await createSessionClient();

  const user: Models.User<Models.Preferences> = await account.get();

  const members: Models.DocumentList<Member> =
    await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

  if (members.total === 0) {
    return { documents: [], total: 0 };
  }

  const workspacesIds: string[] = members.documents.map(
    (member: Member): string => member.workspaceId
  );

  const workspaces: Models.DocumentList<Workspace> =
    await databases.listDocuments<Workspace>(DATABASE_ID, WORKSPACES_ID, [
      Query.orderDesc("$createdAt"),
      Query.contains("$id", workspacesIds),
    ]);

  return workspaces;
};
