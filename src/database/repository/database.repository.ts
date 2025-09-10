import type {
  CreateOptions,
  HydratedDocument,
  UpdateQuery,
  UpdateResult,
} from "mongoose";
import { Model } from "mongoose";
import { NotFoundException } from "../../utils/response";
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
    filter: Partial<TDocument>;
    update: UpdateQuery<TDocument>;
  }): Promise<UpdateResult> {
    const result = await this.model.updateMany(filter as any, update as any);
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
    filter: Partial<HydratedDocument<TDocument>>
  ): Promise<HydratedDocument<TDocument> | null> {
    return this.model.findOne(filter as any).exec();
  }
  async findFilter({
    filter,
  }: {
    filter: Partial<HydratedDocument<TDocument>>;
  }): Promise<HydratedDocument<TDocument>[]> {
    return this.model.find(filter as any).exec();
  }
}
