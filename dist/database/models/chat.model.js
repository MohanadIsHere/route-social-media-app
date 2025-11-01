"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatModel = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    content: { type: String, minlength: 1, maxlength: 500000, required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true,
    optimisticConcurrency: true,
});
const chatSchema = new mongoose_1.Schema({
    participants: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [messageSchema],
    group: { type: String },
    groupImage: { type: String },
    roomId: {
        type: String,
        required: function () {
            return this.roomId;
        },
    },
}, {
    timestamps: true,
    optimisticConcurrency: true,
});
exports.chatModel = mongoose_1.models.Chat || (0, mongoose_1.model)("Chat", chatSchema);
