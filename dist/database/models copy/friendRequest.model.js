"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendRequestModel = void 0;
const mongoose_1 = require("mongoose");
const friendRequestSchema = new mongoose_1.Schema({
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    sendTo: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    acceptedAt: { type: Date },
    rejectedAt: { type: Date },
}, {
    timestamps: true,
    optimisticConcurrency: true,
});
friendRequestSchema.pre(["find", "findOne", "countDocuments"], async function (next) {
    const query = this.getQuery();
    if (query.paranoId === false) {
        this.setQuery({ ...query });
    }
    else {
        this.setQuery({ ...query, freezedAt: { $exists: false } });
    }
    next();
});
friendRequestSchema.pre(["findOneAndUpdate", "updateOne"], async function (next) {
    const query = this.getQuery();
    if (query.paranoId === false) {
        this.setQuery({ ...query });
    }
    else {
        this.setQuery({ ...query, freezedAt: { $exists: false } });
    }
    next();
});
exports.friendRequestModel = mongoose_1.models.FriendRequest || (0, mongoose_1.model)("FriendRequest", friendRequestSchema);
