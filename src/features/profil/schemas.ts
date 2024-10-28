import { z } from "zod";

export const editProfilSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(128),
  avatar: z.union([
    z.instanceof(File),
    z
      .string()
      .transform((value: string): string | undefined =>
        value === "" ? undefined : value
      )
      .optional(),
  ]),
});
