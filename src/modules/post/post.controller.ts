import { Router } from "express";
import postService from "./post.service";
import { authentication, validation } from "../../middlewares";
import { cloudFileUpload, fileValidation } from "../../utils/multer";
import * as validators from "./post.validation";
import { commentRouter } from "../comment";

const postRouter = Router();
postRouter.use("/:postId/comments", commentRouter);
postRouter.get(
  "/",
  authentication(),

  postService.getPosts
);
postRouter.post(
  "/",
  authentication(),
  cloudFileUpload({ validation: fileValidation.image }).array("attachments", 2),
  validation(validators.createPostValidationSchema),
  postService.createPost
);
postRouter.patch(
  "/:postId",
  authentication(),
  cloudFileUpload({ validation: fileValidation.image }).array("attachments", 2),
  validation(validators.updatePostValidationSchema),
  postService.updatePost
);
postRouter.patch("/:postId/like", authentication(), postService.likePost);

export default postRouter;
