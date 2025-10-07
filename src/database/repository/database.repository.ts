import type {
  CreateOptions,
  FlattenMaps,
  HydratedDocument,
  Types,
  UpdateQuery,
  UpdateResult,
} from "mongoose";
import { Model } from "mongoose";
import { NotFoundException } from "../../utils/response";
import type { RootFilterQuery } from "mongoose";
import { QueryOptions } from "mongoose";
export type Lean<T> = HydratedDocument<FlattenMaps<T>>;
export abstract class DatabaseRepository<TDocument> {
  constructor(protected readonly model: Model<TDocument>) {}

  async create({
    data,
    options,
  }: {
    data: Partial<TDocument> | Partial<TDocument>[];
    options?: CreateOptions | undefined;
  }): Promise<HydratedDocument<TDocument> | HydratedDocument<TDocument>[]> {
    return await this.model.create(data as any, options);
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
      throw new NotFoundException("Document not found");
    }
    return result;
  }
  async updateOne({
    filter,
    update,
  }: {
    filter: Partial<HydratedDocument<TDocument>>;
    update: UpdateQuery<TDocument>;
  }): Promise<UpdateResult> {
    return await this.model.updateOne(filter as any, update);
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
  async findByIdAndUpdate({
    id,
    update,
    options = { new: true },
  }: {
    id: Types.ObjectId;
    update: UpdateQuery<TDocument>;
    options?: QueryOptions;
  }): Promise<HydratedDocument<TDocument> | null | Lean<TDocument>> {
    return await this.model.findByIdAndUpdate(
      id,
      { ...update, $inc: { __v: 1 } },
      options
    );
  }
}
