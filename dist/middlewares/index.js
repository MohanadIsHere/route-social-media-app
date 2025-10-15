"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.endpoint = exports.authorization = exports.authentication = exports.validation = void 0;
var validation_middleware_1 = require("./validation.middleware");
Object.defineProperty(exports, "validation", { enumerable: true, get: function () { return validation_middleware_1.validation; } });
var authentication_middleware_1 = require("./authentication.middleware");
Object.defineProperty(exports, "authentication", { enumerable: true, get: function () { return authentication_middleware_1.authentication; } });
Object.defineProperty(exports, "authorization", { enumerable: true, get: function () { return authentication_middleware_1.authorization; } });
Object.defineProperty(exports, "endpoint", { enumerable: true, get: function () { return authentication_middleware_1.endpoint; } });
var error_middleware_1 = require("./error.middleware");
Object.defineProperty(exports, "errorMiddleware", { enumerable: true, get: function () { return __importDefault(error_middleware_1).default; } });
