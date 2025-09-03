"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_repository_1 = require("./database.repository");
const utils_1 = require("../../utils");
class UserRepository extends database_repository_1.DatabaseRepository {
    model;
    constructor(model) {
        super(model);
        this.model = model;
    }
    async createUser({ data, options, }) {
        if (await this.model.findOne({ email: data.email })) {
            throw new utils_1.ConflictException("User already exists");
        }
        const hashed = await (0, utils_1.hashText)({
            plainText: data.password,
        });
        data.password = hashed;
        const encryptedPhone = (0, utils_1.encryptText)({ cipherText: data.phone });
        const oldPhone = data.phone;
        data.phone = encryptedPhone;
        const user = (await this.create({
            data,
            options,
        }));
        user.phone = oldPhone;
        return user;
    }
}
exports.UserRepository = UserRepository;
