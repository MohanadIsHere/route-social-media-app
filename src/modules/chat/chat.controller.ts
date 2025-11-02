import { Router } from "express";
import { authentication, validation } from "../../middlewares";
import * as validators from "./chat.validation";
import { ChatService  } from "./chat.service";
import { cloudFileUpload, fileValidation } from "../../utils/multer";
const chatRouter = Router({ mergeParams: true });
const chatService = new ChatService();

chatRouter.get(
  "/",
  authentication(),
  validation(validators.getChatValidationSchema),
  chatService.getChat
  
);
chatRouter.post(
  "/group",
  authentication(),
  cloudFileUpload({validation: fileValidation.image}).single("attachment"),
  validation(validators.createChattingGroupValidationSchema),
  chatService.createChattingGroup
);
chatRouter.get(
  "/group/:groupId",
  authentication(),
  validation(validators.getChattingGroupValidationSchema),
  chatService.getChattingGroup
);
export default chatRouter;
