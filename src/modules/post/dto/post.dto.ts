import * as validators from "../post.validation"
import {z} from "zod"
export type LikePostQueryInputsDto = z.infer<typeof validators.likePostValidationSchema.query>;