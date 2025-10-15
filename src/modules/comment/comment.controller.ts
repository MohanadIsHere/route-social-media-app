import { Router } from "express";
import { authentication, validation } from "../../middlewares";
import { cloudFileUpload, fileValidation } from "../../utils/multer";
import commentService from "./comment.service";
import * as validators from "./comment.validation"
const commentRouter = Router({ mergeParams: true });
commentRouter.post(
  "/",
  authentication(),
  cloudFileUpload({ validation: fileValidation.image }).array("attachments", 2),
  validation(validators.createCommentValidationSchema),
  commentService.createComment
);
commentRouter.post(
  "/:commentId/reply",
  authentication(),
  cloudFileUpload({ validation: fileValidation.image }).array("attachments", 2),
  validation(validators.replyOnCommentValidationSchema),
  commentService.replyOnComment
);
commentRouter.patch(
  "/:commentId/like",
  authentication(),
  validation(validators.likeCommentValidationSchema),
  commentService.likeComment
);
export default commentRouter;
