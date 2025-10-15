"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeRoleValidationSchema = void 0;
const zod_1 = require("zod");
const general_fields_1 = require("../../utils/general-fields");
const models_1 = require("../../database/models");
exports.changeRoleValidationSchema = {
    params: zod_1.z.strictObject({
        userId: general_fields_1.generalFields.id
    }),
    body: zod_1.z.strictObject({
        role: zod_1.z.enum(models_1.UserRoles)
    })
};
