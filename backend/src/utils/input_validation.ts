import mongoose from "mongoose";
import { z } from "zod";

export interface I_updateContent {
    link?: string,
    type?: string,
    title?: string,
    tags?: string[] | mongoose.Types.ObjectId[],
}

export const contentSchema = z.object({
    link: z.string().url("Invalid Link").min(1,"Link required"),
    type: z.enum(["audio","video","article","image","document","other"]),
    title: z.string(),
    tags : z.array(z.string()).optional()
});

export type ContentInput = z.infer<typeof contentSchema>;

export const validate_email = async (email: string): Promise<boolean> => {
  const emailSchema: z.ZodString = z.string().toLowerCase().email();
  const validatedEmail = await emailSchema.spa(email);
  return validatedEmail.success;
};

export const validate_username = async (username: string): Promise<boolean> => {
  const usernameSchema = z
    .string()
    .regex(/^[a-zA-Z0-9_]+$/)
    .refine((value) => (value.match(/[a-zA-Z]/g) || []).length >= 2);

  const is_username_valid = await usernameSchema.spa(username);
  return is_username_valid.success;
};

export const validate_password = async (password: string): Promise<boolean> => {
  const password_schema = z
    .string()
    .min(8)
    .max(20)
    .refine((password) => /[A-Z]/.test(password))
    .refine((password) => /[a-z]/.test(password))
    .refine((password) => /[0-9]/.test(password))
    .refine((password) => /[!@#$%^&*]/.test(password));
  const is_pass_valid = await password_schema.spa(password);
  return is_pass_valid.success;
};
