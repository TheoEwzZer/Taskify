import { z } from "zod";

export const createWorkspaceSchema = z.object({
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
});

export const updateWorkspaceSchema = z.object({
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
});
