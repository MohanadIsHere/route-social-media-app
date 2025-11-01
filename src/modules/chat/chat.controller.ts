import { Router } from "express";
import { authentication, validation } from "../../middlewares";
import * as validators from "./chat.validation";
import { ChatService  } from "./chat.service";
const chatRouter = Router({ mergeParams: true });
const chatService = new ChatService();

chatRouter.get(
  "/",
  authentication(),
  validation(validators.getChatValidationSchema),
  chatService.getChat
  
);
export default chatRouter;
