"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatValidationSchema = void 0;
const zod_1 = require("zod");
const general_fields_1 = require("../../utils/general-fields");
exports.getChatValidationSchema = {
    params: zod_1.z.strictObject({
        userId: general_fields_1.generalFields.id
    })
};
