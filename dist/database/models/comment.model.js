"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const events_1 = require("../../utils/events");
const env_1 = require("../../config/env");
const templates_1 = require("../../utils/templates");
const repository_1 = require("../repository");
const user_model_1 = require("./user.model");
const post_model_1 = require("./post.model");
const commentSchema = new mongoose_1.Schema({
    content: {
        type: String,
        minlength: 3,
        maxlength: 500000,
        required: function () {
            return !this.attachments?.length;
        },
    },
    attachments: [String],
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true },
    commentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Comment" },
    freezedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    restoredBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    freezedAt: { type: Date },
    restoredAt: { type: Date },
}, {
    timestamps: true,
    optimisticConcurrency: true,
});
commentSchema.post("save", async function (doc) {
    const userModel = new repository_1.UserRepository(user_model_1.User);
    const postModel = new repository_1.PostRepository(post_model_1.Post);
    const commentModel = new repository_1.CommentRepository(exports.Comment);
    if (doc.tags?.length) {
        const taggedUsers = [];
        for (const tagId of doc.tags) {
            const user = await userModel.findOne({ _id: tagId });
            if (user)
                taggedUsers.push(user);
        }
        const createdBy = (await userModel.findOne({
            _id: doc.createdBy,
        }));
        if (createdBy) {
            for (const user of taggedUsers) {
                events_1.emailEvents.emit("sendEmail", {
                    from: `"${env_1.APP_NAME}" <${env_1.APP_EMAIL}>`,
                    to: user.email,
                    subject: "Tag in Comment",
                    text: `${createdBy.firstName || "User"} tagged you in a comment.`,
                    html: templates_1.emailTemplates.taggedInComment({
                        firstName: user.firstName,
                        taggedBy: `${createdBy.firstName} ${createdBy.lastName}`,
                    }),
                });
            }
        }
    }
    const post = await postModel.findOne({ _id: doc.postId });
    if (post && doc.createdBy.toString() !== post.createdBy.toString()) {
        const postOwner = (await userModel.findOne({
            _id: post.createdBy,
        }));
        const commenter = (await userModel.findOne({
            _id: doc.createdBy,
        }));
        if (postOwner && commenter) {
            events_1.emailEvents.emit("sendEmail", {
                from: `"${env_1.APP_NAME}" <${env_1.APP_EMAIL}>`,
                to: postOwner.email,
                subject: "New Comment on Your Post",
                text: `${commenter.firstName || "User"} commented on your post.`,
                html: templates_1.emailTemplates.newCommentOnPost({
                    firstName: postOwner.firstName,
                    commentedBy: `${commenter.firstName} ${commenter.lastName}`,
                }),
            });
        }
    }
    if (doc.commentId) {
        const parentComment = await commentModel.findById(doc.commentId);
        if (parentComment &&
            parentComment.createdBy.toString() !== doc.createdBy.toString()) {
            const parentOwner = (await userModel.findOne({
                _id: parentComment.createdBy,
            }));
            const replier = (await userModel.findOne({
                _id: doc.createdBy,
            }));
            if (parentOwner && replier) {
                events_1.emailEvents.emit("sendEmail", {
                    from: `"${env_1.APP_NAME}" <${env_1.APP_EMAIL}>`,
                    to: parentOwner.email,
                    subject: "Reply to Your Comment",
                    text: `${replier.firstName || "User"} replied to your comment.`,
                    html: templates_1.emailTemplates.replyToComment({
                        firstName: parentOwner.firstName,
                        repliedBy: `${replier.firstName} ${replier.lastName}`,
                    }),
                });
            }
        }
    }
});
commentSchema.pre(["find", "findOne", "countDocuments"], async function (next) {
    const query = this.getQuery();
    if (query.paranoId === false) {
        this.setQuery({ ...query });
    }
    else {
        this.setQuery({ ...query, freezedAt: { $exists: false } });
    }
    next();
});
commentSchema.pre(["findOneAndUpdate", "updateOne"], async function (next) {
    const query = this.getQuery();
    if (query.paranoId === false) {
        this.setQuery({ ...query });
    }
    else {
        this.setQuery({ ...query, freezedAt: { $exists: false } });
    }
    next();
});
exports.Comment = mongoose_1.models.Comment || (0, mongoose_1.model)("Comment", commentSchema);
