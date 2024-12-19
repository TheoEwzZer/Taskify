import { z } from "zod";

export const createProjectSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(128).optional(),
  name: z.string().trim().min(1, "Name is required").max(128),
  image: z.union([
    z.instanceof(File),
    z
      .string()
      .transform((value: string): string | undefined =>
        value === "" ? undefined : value
      )
      .optional(),
  ]),
  workspaceId: z.string(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  assigneeIds: z.array(z.string().trim().max(50)).optional(),
});

export const updateProjectSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(128).optional(),
  name: z
    .string()
    .trim()
    .min(1, "Must be at least 1 character")
    .max(128)
    .optional(),
  image: z.union([
    z.instanceof(File),
    z
      .string()
      .transform((value: string): string | undefined =>
        value === "" ? undefined : value
      )
      .optional(),
  ]),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  assigneeIds: z.array(z.string().trim().max(50)).optional(),
});
