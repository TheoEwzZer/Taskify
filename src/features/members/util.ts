import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Databases, Models, Query } from "node-appwrite";

interface GetMemberProps {
  databases: Databases;
  workspaceId: string;
  userId: string;
}

export const getMember: ({
  databases,
  workspaceId,
  userId,
}: GetMemberProps) => Promise<Models.Document> = async ({
  databases,
  workspaceId,
  userId,
}: GetMemberProps) => {
  const members: Models.DocumentList<Models.Document> =
    await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.equal("userId", userId),
    ]);

  return members.documents[0];
};
