"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRepository = void 0;
const utils_1 = require("../../utils");
class DatabaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create({ data, options, }) {
        return await this.model.create(data, options);
    }
    async update({ filter, update, }) {
        const result = await this.model.updateMany(filter, update);
        if (!result.matchedCount) {
            throw new utils_1.NotFoundException("Document not found");
        }
        return result;
    }
    async findOne(filter) {
        return this.model.findOne(filter).exec();
    }
    async findFilter({ filter, }) {
        return this.model.find(filter).exec();
    }
}
exports.DatabaseRepository = DatabaseRepository;
