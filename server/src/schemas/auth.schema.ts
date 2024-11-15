import { z } from "zod";

export const emailSchema = z.string().email().min(5).max(255);

export const passwordSchema = z.string().min(8).max(255);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: passwordSchema,
    name: z.string().min(3).max(255),
  })
  .refine((data) => {
    return (
      data.password === data.confirmPassword,
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }
    );
  });
