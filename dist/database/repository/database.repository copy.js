"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRepository = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../../utils");
const env_1 = require("../../config/env");
class DatabaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create({ data, options, }) {
        return await this.model.create(data, options);
    }
    async createUser({ data, options, }) {
        if (data[0]?.password) {
            data[0].password = await bcrypt_1.default.hash(data[0].password, Number(env_1.SALT_ROUNDS));
        }
        const [user] = (await this.model.create(data, options)) || [];
        if (!user) {
            throw new utils_1.BadRequestException("User registration failed");
        }
        return user;
    }
}
exports.DatabaseRepository = DatabaseRepository;
