import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Databases, Models, Query } from "node-appwrite";
import { Member } from "./types";

interface GetMemberProps {
  databases: Databases;
  workspaceId: string;
  userId: string;
}

export const getMember: ({
  databases,
  workspaceId,
  userId,
}: GetMemberProps) => Promise<Member> = async ({
  databases,
  workspaceId,
  userId,
}: GetMemberProps): Promise<Member> => {
  const members: Models.DocumentList<Member> =
    await databases.listDocuments<Member>(DATABASE_ID, MEMBERS_ID, [
      Query.equal("workspaceId", workspaceId),
      Query.equal("userId", userId),
    ]);

  return members.documents[0];
};
