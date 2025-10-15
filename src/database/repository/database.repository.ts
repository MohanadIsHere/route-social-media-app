import type {
  CreateOptions,
  FlattenMaps,
  HydratedDocument,
  Types,
  UpdateQuery,
  UpdateResult,
  RootFilterQuery,
  QueryOptions,
  MongooseUpdateQueryOptions,
} from "mongoose";
import { Model } from "mongoose";
import { NotFoundException } from "../../utils/response";

export type Lean<T> = FlattenMaps<T>;

export abstract class DatabaseRepository<TDocument> {
  constructor(protected readonly model: Model<TDocument>) {}

  async create({
    data,
    options,
  }: {
    data: Partial<TDocument> | Partial<TDocument>[];
    options?: CreateOptions | undefined;
  }): Promise<HydratedDocument<TDocument> | HydratedDocument<TDocument>[]> {
    return this.model.create(data as any, options);
  }

  async updateMany({
    filter,
    update,
  }: {
    filter: Partial<RootFilterQuery<TDocument>>;
    update: UpdateQuery<TDocument>;
  }): Promise<UpdateResult> {
    const result = await this.model.updateMany(filter, update);
    if (!result.matchedCount) {
      throw new NotFoundException("Documents not found");
    }
    return result;
  }

  async updateOne({
    filter,
    update,
    options,
  }: {
    filter: Partial<RootFilterQuery<TDocument>>;
    update: UpdateQuery<TDocument>;
    options?: MongooseUpdateQueryOptions<TDocument> | null;
  }): Promise<UpdateResult> {
    if (Array.isArray(update)) {
      update.push({
        $set: {
          __v: { $add: ["$__v", 1] },
        },
      });
      return await this.model.updateOne(filter || {}, update, options);
    }
    return await this.model.updateOne(
      filter || {},
      { ...update, inc: { __v: 1 } },
      options
    );
  }

  async findOne(
    filter: Partial<RootFilterQuery<TDocument>>,
    options?: QueryOptions
  ): Promise<HydratedDocument<TDocument> | null> {
    return this.model.findOne(filter, null,options).exec();
  }

  async findFilter({
    filter,
    options = {},
  }: {
    filter: Partial<RootFilterQuery<TDocument>>;
    options?: QueryOptions;
  }): Promise<HydratedDocument<TDocument>[]> {
    return this.model.find(filter, null, options).exec();
  }
  async findAndPaginate({
    filter,
    options = {},
    page = 1,
    size = 5,
  }: {
    filter: Partial<RootFilterQuery<TDocument>>;
    options?: QueryOptions;
    page?: number;
    size?: number;
  }): Promise<{
    docsCount: number;
    limit: number;
    pages: number;
    currentPage: number;
    result: HydratedDocument<TDocument>[];
  }> {
    let docsCount: number | undefined = undefined;
    let pages: number | undefined = undefined;

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

  async findById(
    id: Types.ObjectId
  ): Promise<HydratedDocument<TDocument> | null> {
    return this.model.findById(id).exec();
  }

  async findOneAndUpdate({
    filter,
    update,
    options = { new: true },
  }: {
    filter: RootFilterQuery<TDocument>;
    update: UpdateQuery<TDocument>;
    options?: QueryOptions;
  }): Promise<HydratedDocument<TDocument> | null> {
    const result = await this.model.findOneAndUpdate(
      filter,
      {
        ...update,
        $inc: { __v: 1 },
      },
      options
    );


    if (!result) {
      throw new NotFoundException("Document not found");
    }

    return result;
  }
}
