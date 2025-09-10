import { z } from "zod";
import { LoginSchema, LogoutSchema, RegisterSchema } from "../auth.validation";

export type RegisterBodyDto = z.infer<typeof RegisterSchema.body>;
export type LoginBodyDto = z.infer<typeof LoginSchema.body>;
export type LogoutBodyDto = z.infer<typeof LogoutSchema.body>;
