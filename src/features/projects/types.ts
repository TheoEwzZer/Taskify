import { Models } from "node-appwrite";

export type Project = Models.Document & {
  name: string;
  imageUrl: string;
  workspaceId: string;
  startDate: string | undefined;
  endDate: string | undefined;
  assigneeIds: string[];
  label: string | undefined;
};
