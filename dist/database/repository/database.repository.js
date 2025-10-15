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
    async findOne(filter, options) {
        return this.model.findOne(filter, null, options).exec();
    }
    async findFilter({ filter, options = {}, }) {
        return this.model.find(filter, null, options).exec();
    }
    async findAndPaginate({ filter, options = {}, page = 1, size = 5, }) {
        let docsCount = undefined;
        let pages = undefined;
        page = Math.floor(page < 1 ? 1 : page);
        options.limit = Math.floor(size < 1 || !size ? 5 : size);
        options.skip = (page - 1) * options.limit;
        docsCount = await this.model.countDocuments(filter);
        pages = Math.ceil(docsCount / options.limit);
        const result = await this.findFilter({ filter, options });
        return {
            docsCount,
            limit: options.limit,
            pages,
            currentPage: page,
            result,
        };
    }
    async findById(id) {
        return this.model.findById(id).exec();
    }
    async findOneAndUpdate({ filter, update, options = { new: true }, }) {
        const result = await this.model.findOneAndUpdate(filter, {
            ...update,
            $inc: { __v: 1 },
        }, options);
        return result;
    }
}
exports.DatabaseRepository = DatabaseRepository;
