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
        return this.model.create(data, options);
    }
    async updateMany({ filter, update, }) {
        const result = await this.model.updateMany(filter, update);
        if (!result.matchedCount) {
            throw new response_1.NotFoundException("Documents not found");
        }
        return result;
    }
    async updateOne({ filter, update, options, }) {
        if (Array.isArray(update)) {
            update.push({
                $set: {
                    __v: { $add: ["$__v", 1] },
                },
            });
            return await this.model.updateOne(filter || {}, update, options);
        }
        return await this.model.updateOne(filter || {}, { ...update, inc: { __v: 1 } }, options);
    }
    async findOne(filter) {
        return this.model.findOne(filter).exec();
    }
    async findFilter({ filter, }) {
        return this.model.find(filter).exec();
    }
    async findById(id) {
        return this.model.findById(id).exec();
    }
    async findOneAndUpdate({ filter, update, options = { new: true }, }) {
        const result = await this.model.findOneAndUpdate(filter, { $inc: { __v: 1 }, ...(update || {}) }, options);
        if (!result) {
            throw new response_1.NotFoundException("Document not found");
        }
        return result;
    }
}
exports.DatabaseRepository = DatabaseRepository;
