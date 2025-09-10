"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRepository = void 0;
const response_1 = require("../../utils/response");
class DatabaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create({ data, options, }) {
        return await this.model.create(data, options);
    }
    async updateMany({ filter, update, }) {
        const result = await this.model.updateMany(filter, update);
        if (!result.matchedCount) {
            throw new response_1.NotFoundException("Document not found");
        }
        return result;
    }
    async updateOne({ filter, update, }) {
        return await this.model.updateOne(filter, update);
    }
    async findOne(filter) {
        return this.model.findOne(filter).exec();
    }
    async findFilter({ filter, }) {
        return this.model.find(filter).exec();
    }
}
exports.DatabaseRepository = DatabaseRepository;
