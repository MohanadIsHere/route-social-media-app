import { Model, type PopulateOptions } from "mongoose";
import { DatabaseRepository } from "./database.repository";
import { CommentModel, IPost } from "../models";
import { RootFilterQuery } from "mongoose";
import { QueryOptions } from "mongoose";
import { HydratedDocument } from "mongoose";
import { CommentRepository } from "./comment.repository";

export class PostRepository extends DatabaseRepository<IPost> {
    private commentModel = new CommentRepository(CommentModel);
  
  constructor(protected override readonly model: Model<IPost>) {
    super(model);
  }
  async findCursor({
    filter,
    options = {},
  }: {
    filter: Partial<RootFilterQuery<IPost>>;
    options?: QueryOptions;
  }): Promise<HydratedDocument<IPost>[]> {
    let result = [] ;
    const cursor = await this.model
      .find(filter || {})
      .populate(options.populate as PopulateOptions[])
      .cursor();

      for (let doc = await cursor.next(); doc !=null; doc= await cursor.next()) {
        
    
      const comments = await this.commentModel.findFilter({
        filter: { postId: doc._id, commentId: { $exists: false } },
      });
      result.push({ doc, comments });
    
        
      }

    return result as unknown as HydratedDocument<IPost>[];
  }
}
