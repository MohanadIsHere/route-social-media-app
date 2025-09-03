"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptText = exports.encryptText = void 0;
const crypto_js_1 = require("crypto-js");
const env_1 = require("../../../config/env");
const encryptText = ({ cipherText, encryptionKey = env_1.ENCRYPTION_KEY, }) => {
    return crypto_js_1.AES.encrypt(cipherText, encryptionKey).toString();
};
exports.encryptText = encryptText;
const decryptText = ({ cipherText, encryptionKey = env_1.ENCRYPTION_KEY, }) => {
    return crypto_js_1.AES.decrypt(cipherText, encryptionKey).toString();
};
exports.decryptText = decryptText;
