"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = exports.AvailabilityEnum = exports.AllowCommentsEnum = void 0;
const mongoose_1 = require("mongoose");
const events_1 = require("../../utils/events");
const env_1 = require("../../config/env");
const templates_1 = require("../../utils/templates");
const repository_1 = require("../repository");
const user_model_1 = require("./user.model");
var AllowCommentsEnum;
(function (AllowCommentsEnum) {
    AllowCommentsEnum["allow"] = "allow";
    AllowCommentsEnum["deny"] = "deny";
})(AllowCommentsEnum || (exports.AllowCommentsEnum = AllowCommentsEnum = {}));
var AvailabilityEnum;
(function (AvailabilityEnum) {
    AvailabilityEnum["public"] = "public";
    AvailabilityEnum["onlyMe"] = "only-Me";
    AvailabilityEnum["friends"] = "friends";
})(AvailabilityEnum || (exports.AvailabilityEnum = AvailabilityEnum = {}));
const postSchema = new mongoose_1.Schema({
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
    tags: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    freezedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    restoredBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    freezedAt: { type: Date },
    restoredAt: { type: Date },
}, {
    timestamps: true,
    optimisticConcurrency: true,
});
postSchema.post("save", async function (doc) {
    if (!doc.tags?.length)
        return;
    const userModel = new repository_1.UserRepository(user_model_1.User);
    let taggedUsers = [];
    for (const element of doc.tags) {
        taggedUsers.push((await userModel.findOne({ _id: element })));
    }
    const createdBy = (await userModel.findOne({
        _id: doc.createdBy,
    }));
    for (const user of taggedUsers) {
        events_1.emailEvents.emit("sendEmail", {
            from: `"${env_1.APP_NAME}" <${env_1.APP_EMAIL}>`,
            to: user.email,
            subject: "Tag in Post",
            text: `${createdBy.firstName || "user"} tagged you in a post.`,
            html: templates_1.emailTemplates.taggedInPost({
                firstName: user.firstName,
                taggedBy: `${createdBy.firstName} ${createdBy.lastName}`,
                postContent: doc.content || "No content",
                postType: doc.availability,
            }),
        });
    }
});
exports.Post = mongoose_1.models.Post || (0, mongoose_1.model)("Post", postSchema);
