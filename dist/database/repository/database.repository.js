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
    async findFilter({ filter, }) {
        const filterResult = await this.model.find({ ...filter });
        if (!filterResult || !filterResult.length) {
            throw new utils_1.NotFoundException("No documents found");
        }
        return filterResult;
    }
    async update({ filter, update, }) {
        const result = await this.model.updateMany(filter, update);
        if (!result.matchedCount) {
            throw new utils_1.NotFoundException("Document not found");
        }
        return result;
    }
}
exports.DatabaseRepository = DatabaseRepository;
