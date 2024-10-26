import { Models } from "node-appwrite";
import { Project } from "../projects/types";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export type Task = Models.Document & {
  project: Project | undefined;
  assignee:
    | (Models.Document & {
        name: string;
        email: string;
      })
    | undefined;
  name: string;
  status: TaskStatus;
  workspaceId: string;
  assigneeId: string;
  projectId: string;
  position: number;
  dueDate: string;
  description?: string;
};
