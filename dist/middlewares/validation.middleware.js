"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const utils_1 = require("../utils");
const validation = (schema) => {
    return (req, res, next) => {
        const validationErrors = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const { error, success } = schema[key].safeParse(req[key]);
            if (!success) {
                const errors = error;
                validationErrors.push({
                    key,
                    issues: errors.issues.map((issue) => ({
                        message: issue.message,
                        path: issue.path[0],
                    })),
                });
            }
        }
        if (validationErrors.length) {
            throw new utils_1.BadRequestException("Validation Error", {
                cause: validationErrors,
            });
        }
        return next();
    };
};
exports.validation = validation;
