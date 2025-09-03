import { z } from "zod";
import { RegisterSchema } from "../auth.validation";

export type RegisterBodyDto = z.infer<typeof RegisterSchema.body>;
