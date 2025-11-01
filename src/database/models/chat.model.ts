import { model, models, Schema } from "mongoose";
import { HydratedDocument } from "mongoose";
import { Types } from "mongoose";
export interface IMessage {
  content: string;
  createdBy: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}
export type HydratedChatDoc = HydratedDocument<IChat>;
export type HydratedMessageDoc = HydratedDocument<IMessage>;

export interface IChat {
  // OVO
  participants: Types.ObjectId[];
  createdBy: Types.ObjectId;
  messages: IMessage[];
  // OVM
  group?: string;
  groupImage?: string;
  roomId?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
const messageSchema = new Schema<IMessage>(
  {
    content: { type: String, minlength: 1, maxlength: 500000, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);
const chatSchema = new Schema<IChat>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    messages: [messageSchema],
    group: { type: String },
    groupImage: { type: String },
    roomId: {
      type: String,
      required: function () {
        return this.roomId;
      },
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);
export const chatModel = models.Chat || model<IChat>("Chat", chatSchema);