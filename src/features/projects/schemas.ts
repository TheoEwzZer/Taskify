import { z } from "zod";

export const createProjectSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Label is required")
    .max(128)
    .nullable()
    .optional(),
  name: z.string().trim().min(1, "Name is required").max(128),
  workspaceId: z.string(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  assigneeIds: z.array(z.string().trim().max(50)).optional(),
  dates: z
    .union([
      z.object({
        title: z.string().trim().min(1, "Title is required").max(128),
        date: z.coerce.date(),
      }),
      z.array(
        z.object({
          title: z.string().trim().min(1, "Title is required").max(128),
          date: z.coerce.date(),
        })
      ),
    ])
    .transform((dates: any): any => (Array.isArray(dates) ? dates : [dates]))
    .optional(),
});

export const updateProjectSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, "Label is required")
    .max(128)
    .nullable()
    .optional(),
  name: z
    .string()
    .trim()
    .min(1, "Must be at least 1 character")
    .max(128)
    .optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  assigneeIds: z.array(z.string().trim().max(50)).optional(),
  dates: z
    .union([
      z.object({
        title: z.string().trim().min(1, "Title is required").max(128),
        date: z.coerce.date(),
      }),
      z.array(
        z.object({
          title: z.string().trim().min(1, "Title is required").max(128),
          date: z.coerce.date(),
        })
      ),
    ])
    .transform((dates: any): any => (Array.isArray(dates) ? dates : [dates]))
    .optional(),
});
