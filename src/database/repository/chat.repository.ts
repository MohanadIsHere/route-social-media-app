import { Model } from "mongoose";
import { DatabaseRepository, Lean } from "./database.repository";
import { HydratedChatDoc, IChat } from "../models";
import { RootFilterQuery } from "mongoose";
import type { QueryOptions, ProjectionType, PopulateOptions } from "mongoose";

export class ChatRepository extends DatabaseRepository<IChat> {
  constructor(protected override readonly model: Model<IChat>) {
    super(model);
  }

  async findOneChat({
    filter,
    select = {},
    options,
    page = 1,
    size = 5,
  }: {
    filter: Partial<RootFilterQuery<IChat>>;
    select?: ProjectionType<IChat> | undefined;
    options?: QueryOptions;
    page?: number | undefined;
    size?: number | undefined;
  }): Promise<HydratedChatDoc | null | Lean<IChat>> {
    page = Math.floor(!page || page < 1 ? 1 : page);
    size = Math.floor(size < 1 || !size ? 5 : size);
    const doc = this.model.findOne(filter, {
      messages: { $slice: [-(page * size), size] },
    });
    if (options?.populate) {
      doc.populate(options.populate as PopulateOptions[]);
    }
    if (options?.lean) {
      doc.lean(options.lean);
    }

    return await doc.exec();
  }
}
