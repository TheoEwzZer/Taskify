import { Models } from "node-appwrite";
import { Member } from "../members/types";
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
  assignees: Member[];
  name: string;
  status: TaskStatus;
  workspaceId: string;
  assigneeIds: string[];
  projectId: string;
  position: number;
  dueDate: string | null;
  description?: string;
};
