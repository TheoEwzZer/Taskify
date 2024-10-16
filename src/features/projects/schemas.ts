import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
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
});
