"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_NAME = exports.NODE_ENV = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: "./.env" });
_a = process.env, exports.PORT = _a.PORT, exports.NODE_ENV = _a.NODE_ENV, exports.APP_NAME = _a.APP_NAME;
