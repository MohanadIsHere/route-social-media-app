import { HydratedDocument, model, models, Schema, Types } from "mongoose";
import { emailEvents } from "../../utils/events";
import { APP_EMAIL, APP_NAME } from "../../config/env";
import { emailTemplates } from "../../utils/templates";
import { CommentRepository, PostRepository, UserRepository } from "../repository";
import { HydratedUserDoc, userModel } from "./user.model";
import { IPost, postModel } from "./post.model";


export interface IComment {
  createdBy: Types.ObjectId;
  postId: Types.ObjectId | Partial<IPost>;
  commentId?: Types.ObjectId;

  content?: string;
  attachments?: string[];

  tags?: Types.ObjectId[];
  likes?: Types.ObjectId[];

  freezedBy?: Types.ObjectId;
  freezedAt?: Date;

  restoredAt?: Date;
  restoredBy?: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}
export type HydratedCommentDoc = HydratedDocument<IComment>;
const commentSchema = new Schema<IComment>(
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

    tags: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    commentId: { type: Schema.Types.ObjectId, ref: "Comment"},

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
commentSchema.post("save", async function (doc: IComment) {
  const _userModel = new UserRepository(userModel);
  const _postModel = new PostRepository(postModel);

  const _commentModel = new CommentRepository(commentModel)

  // send email to tagged users
  if (doc.tags?.length) {
    const taggedUsers: HydratedUserDoc[] = [];

    for (const tagId of doc.tags) {
      const user = await _userModel.findOne({ _id: tagId });
      if (user) taggedUsers.push(user as HydratedUserDoc);
    }

    const createdBy = (await _userModel.findOne({
      _id: doc.createdBy,
    })) as HydratedUserDoc;

    if (createdBy) {
      for (const user of taggedUsers) {
        emailEvents.emit("sendEmail", {
          from: `"${APP_NAME}" <${APP_EMAIL}>`,
          to: user.email,
          subject: "Tag in Comment",
          text: `${createdBy.firstName || "User"} tagged you in a comment.`,
          html: emailTemplates.taggedInComment({
            firstName: user.firstName,
            taggedBy: `${createdBy.firstName} ${createdBy.lastName}`,
          }),
        });
      }
    }
  }

  // send email to post owner when someone comments on his post
  const post = await _postModel.findOne({ _id: doc.postId });
  if (post && doc.createdBy.toString() !== post.createdBy.toString()) {
    const postOwner = (await _userModel.findOne({
      _id: post.createdBy,
    })) as HydratedUserDoc;
    const commenter = (await _userModel.findOne({
      _id: doc.createdBy,
    })) as HydratedUserDoc;

    if (postOwner && commenter) {
      emailEvents.emit("sendEmail", {
        from: `"${APP_NAME}" <${APP_EMAIL}>`,
        to: postOwner.email,
        subject: "New Comment on Your Post",
        text: `${commenter.firstName || "User"} commented on your post.`,
        html: emailTemplates.newCommentOnPost({
          firstName: postOwner.firstName,
          commentedBy: `${commenter.firstName} ${commenter.lastName}`,
        }),
      });
    }
  }

  // send email to comment owner if someone replied to his comment
  if (doc.commentId) {
    const parentComment = await _commentModel.findById(doc.commentId);
    if (
      parentComment &&
      parentComment.createdBy.toString() !== doc.createdBy.toString()
    ) {
      const parentOwner = (await _userModel.findOne({
        _id: parentComment.createdBy,
      })) as HydratedUserDoc;
      const replier = (await _userModel.findOne({
        _id: doc.createdBy,
      })) as HydratedUserDoc;

      if (parentOwner && replier) {
        emailEvents.emit("sendEmail", {
          from: `"${APP_NAME}" <${APP_EMAIL}>`,
          to: parentOwner.email,
          subject: "Reply to Your Comment",
          text: `${replier.firstName || "User"} replied to your comment.`,
          html: emailTemplates.replyToComment({
            firstName: parentOwner.firstName,
            repliedBy: `${replier.firstName} ${replier.lastName}`,
          }),
        });
      }
    }
  }
});


commentSchema.pre(["find", "findOne","countDocuments"], async function (next) {
  const query = this.getQuery();
  if (query.paranoId === false) {
    this.setQuery({ ...query });
  } else {
    this.setQuery({ ...query, freezedAt: { $exists: false } });
  }
  next();
});
commentSchema.pre(["findOneAndUpdate", "updateOne"], async function (next) {
  const query = this.getQuery();
  if (query.paranoId === false) {
    this.setQuery({ ...query });
  } else {
    this.setQuery({ ...query, freezedAt: { $exists: false } });
  }
  next();
});
export const commentModel = models.Comment || model<IComment>("Comment", commentSchema);
