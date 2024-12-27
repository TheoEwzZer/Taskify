import { Models } from "node-appwrite";

export type Project = Models.Document & {
  name: string;
  imageUrl: string;
  workspaceId: string;
  startDate: string | undefined;
  endDate: string | undefined;
  assigneeIds: string[];
  label: string | undefined;
  dates: ProjectDates[];
};

export type ProjectDates = Models.Document & {
  title: string;
  date: string;
  projectId: string;
};

export interface DateItem {
  title: string;
  date: Date;
}
