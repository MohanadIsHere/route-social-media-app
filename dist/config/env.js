"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_EMAIL_PASSWORD = exports.APP_EMAIL = exports.ENCRYPTION_KEY = exports.SALT_ROUNDS = exports.DB_URI = exports.APP_NAME = exports.NODE_ENV = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: "./.env", quiet: true });
_a = process.env, exports.PORT = _a.PORT, exports.NODE_ENV = _a.NODE_ENV, exports.APP_NAME = _a.APP_NAME, exports.DB_URI = _a.DB_URI, exports.SALT_ROUNDS = _a.SALT_ROUNDS, exports.ENCRYPTION_KEY = _a.ENCRYPTION_KEY, exports.APP_EMAIL = _a.APP_EMAIL, exports.APP_EMAIL_PASSWORD = _a.APP_EMAIL_PASSWORD;
