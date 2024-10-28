import { z } from "zod";
import { TaskStatus } from "./types";

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(128),
  status: z.nativeEnum(TaskStatus, { required_error: "Status is required" }),
  workspaceId: z.string().trim().min(1, "Workspace is required").max(50),
  projectId: z.string().trim().min(1, "Project is required").max(50),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().max(50).optional(),
  description: z.string().max(2048).optional(),
});

export const editTaskSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(128),
  status: z.nativeEnum(TaskStatus, { required_error: "Status is required" }),
  workspaceId: z.string().trim().min(1, "Workspace is required").max(50),
  projectId: z.string().trim().min(1, "Project is required").max(50),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().max(50).optional(),
  description: z.string().max(2048).optional(),
});
