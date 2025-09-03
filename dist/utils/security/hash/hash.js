"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHash = exports.hashText = void 0;
const env_1 = require("../../../config/env");
const bcrypt_1 = require("bcrypt");
const hashText = async ({ plainText, saltRounds = Number(env_1.SALT_ROUNDS), }) => {
    return await (0, bcrypt_1.hash)(plainText, saltRounds);
};
exports.hashText = hashText;
const compareHash = async ({ plainText, cipherText, }) => {
    return await (0, bcrypt_1.compare)(plainText, cipherText);
};
exports.compareHash = compareHash;
