import { Models } from "node-appwrite";

export type Project = Models.Document & {
  name: string;
  workspaceId: string;
  startDate: string | undefined;
  endDate: string | undefined;
  assigneeIds: string[];
  label: string | undefined;
  dates: DatesString[];
};

export type DatesString = {
  title: string;
  date: string;
};

export type ProjectDates = Models.Document & {
  title: string;
  date: string;
};

export interface DateItem {
  title: string;
  date: Date;
}
