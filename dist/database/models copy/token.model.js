"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenModel = void 0;
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    jti: { type: String, required: true, unique: true },
    expiresIn: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true,
    optimisticConcurrency: true,
});
exports.tokenModel = mongoose_1.models.Token || (0, mongoose_1.model)("Token", tokenSchema);
