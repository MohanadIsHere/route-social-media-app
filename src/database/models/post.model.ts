import { HydratedDocument, model, models, Schema, Types } from "mongoose";
import { emailEvents } from "../../utils/events";
import { APP_EMAIL, APP_NAME } from "../../config/env";
import { emailTemplates } from "../../utils/templates";
import { UserRepository } from "../repository";
import { HydratedUserDoc, User } from "./user.model";

export enum AllowCommentsEnum {
  allow = "allow",
  deny = "deny",
}
export enum AvailabilityEnum {
  public = "public",
  onlyMe = "only-Me",
  friends = "friends",
}
export enum LikeActionEnum {
  like='like',
  dislike='dislike'
}
export interface IPost {
  content?: string;
  attachments?: string[];

  allowComments?: AllowCommentsEnum;
  availability?: AvailabilityEnum;
  assetsFolderId?: string;

  tags?: Types.ObjectId[];
  likes?: Types.ObjectId[];
  createdBy: Types.ObjectId;

  freezedBy?: Types.ObjectId;
  freezedAt?: Date;

  restoredAt?: Date;
  restoredBy?: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}
export type HydratedPostDoc = HydratedDocument<IPost>;
const postSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      minlength: 3,
      maxlength: 500000,
      required: function () {
        return !this.attachments?.length;
      },
    },
    attachments: [String],
    assetsFolderId: { type: String, required: true },
    allowComments: {
      type: String,
      enum: AllowCommentsEnum,
      default: AllowCommentsEnum.allow,
    },
    availability: {
      type: String,
      enum: AvailabilityEnum,
      default: AvailabilityEnum.public,
    },
    tags: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    freezedBy: { type: Schema.Types.ObjectId, ref: "User" },
    restoredBy: { type: Schema.Types.ObjectId, ref: "User" },
    freezedAt: { type: Date },
    restoredAt: { type: Date },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);
postSchema.post("save", async function (doc) {
  if (!doc.tags?.length) return;
  const userModel = new UserRepository(User);
  let taggedUsers: HydratedUserDoc[] = [];
  for (const element of doc.tags) {
    taggedUsers.push(
      (await userModel.findOne({ _id: element })) as HydratedUserDoc
    );
  }
  const createdBy = (await userModel.findOne({
    _id: doc.createdBy,
  })) as HydratedUserDoc;
  for (const user of taggedUsers) {
    emailEvents.emit("sendEmail", {
      from: `"${APP_NAME}" <${APP_EMAIL}>`,
      to: user.email,
      subject: "Tag in Post",
      text: `${createdBy.firstName || "user"} tagged you in a post.`,
      html: emailTemplates.taggedInPost({
        firstName: user.firstName,
        taggedBy: `${createdBy.firstName} ${createdBy.lastName}`,
        postContent: doc.content || "No content",
        postType: doc.availability!,
      }),
    });
  }
});
postSchema.pre(["find", "findOne","countDocuments"], async function (next) {
  const query = this.getQuery();
  if (query.paranoId === false) {
    this.setQuery({ ...query });
  } else {
    this.setQuery({ ...query, freezedAt: { $exists: false } });
  }
  next();
});
postSchema.pre(["findOneAndUpdate", "updateOne"], async function (next) {
  const query = this.getQuery();
  if (query.paranoId === false) {
    this.setQuery({ ...query });
  } else {
    this.setQuery({ ...query, freezedAt: { $exists: false } });
  }
  next();
});
export const Post = models.Post || model<IPost>("Post", postSchema);
