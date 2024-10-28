import { Models } from "node-appwrite";

export type Member = Models.Document & {
  name: string;
  email: string;
  userId: string;
  workspaceId: string;
  role: MemberRole;
  avatar: string | undefined;
};

export enum MemberRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}
