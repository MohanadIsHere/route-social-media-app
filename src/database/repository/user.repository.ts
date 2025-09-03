import { Model, HydratedDocument, CreateOptions } from "mongoose";
import { IUser } from "../models/user.model";
import { DatabaseRepository } from "./database.repository";

import { ConflictException, encryptText, hashText } from "../../utils";

export class UserRepository extends DatabaseRepository<IUser> {
  constructor(protected override readonly model: Model<IUser>) {
    super(model);
  }

  async createUser({
    data,
    options,
  }: {
    data: Partial<IUser>;
    options?: CreateOptions;
  }): Promise<HydratedDocument<IUser>> {
    // check if user exists
    if (await this.model.findOne({ email: data.email })) {
      throw new ConflictException("User already exists");
    }

    // hash password
    const hashed = await hashText({
      plainText: data.password as string,
    });
    data.password = hashed;
    // encrypt phone
    const encryptedPhone = encryptText({ cipherText: data.phone as string });
    const oldPhone = data.phone;
    data.phone = encryptedPhone;
    const user = (await this.create({
      data,
      options,
    })) as HydratedDocument<IUser>;
    user.phone = oldPhone as string;

    return user;
  }
}
