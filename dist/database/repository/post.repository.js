"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const database_repository_1 = require("./database.repository");
const models_1 = require("../models");
const comment_repository_1 = require("./comment.repository");
class PostRepository extends database_repository_1.DatabaseRepository {
    model;
    commentModel = new comment_repository_1.CommentRepository(models_1.CommentModel);
    constructor(model) {
        super(model);
        this.model = model;
    }
    async findCursor({ filter, options = {}, }) {
        let result = [];
        const cursor = await this.model
            .find(filter || {})
            .populate(options.populate)
            .cursor();
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            const comments = await this.commentModel.findFilter({
                filter: { postId: doc._id, commentId: { $exists: false } },
            });
            result.push({ doc, comments });
        }
        return result;
    }
}
exports.PostRepository = PostRepository;
