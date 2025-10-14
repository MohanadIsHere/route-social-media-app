import type {
  CreateOptions,
  FlattenMaps,
  HydratedDocument,
  Types,
  UpdateQuery,
  UpdateResult,
  RootFilterQuery,
  QueryOptions,
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
  }: {
    filter: Partial<RootFilterQuery<TDocument>>;
    update: UpdateQuery<TDocument>;
  }): Promise<UpdateResult> {
    const result = await this.model.updateOne(filter as any, update);
    if (!result.matchedCount) {
      throw new NotFoundException("Document not found");
    }
    return result;
  }

  async findOne(
    filter: Partial<RootFilterQuery<TDocument>>
  ): Promise<HydratedDocument<TDocument> | null> {
    return this.model.findOne(filter).exec();
  }

  async findFilter({
    filter,
  }: {
    filter: Partial<RootFilterQuery<TDocument>>;
  }): Promise<HydratedDocument<TDocument>[]> {
    return this.model.find(filter).exec();
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
      { $inc: { __v: 1 }, ...(update || {}) },
      options
    );

    if (!result) {
      throw new NotFoundException("Document not found");
    }

    return result;
  }
}
