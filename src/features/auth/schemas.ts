import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(128),
  email: z.string().email().min(1, "Email is required"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});
