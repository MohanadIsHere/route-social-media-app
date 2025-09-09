import { z } from "zod";
import { LoginSchema, RegisterSchema } from "../auth.validation";

export type RegisterBodyDto = z.infer<typeof RegisterSchema.body>;
export type LoginBodyDto = z.infer<typeof LoginSchema.body>;
