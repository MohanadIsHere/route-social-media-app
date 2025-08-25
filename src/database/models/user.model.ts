import  { Types, Schema, models, model } from "mongoose";

export enum UserGenders {
  male = "male",
  female = "female",
}
export enum UserRoles {
  user = "user",
  admin = "admin",
}
export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  middleName?: string;
  lastName: string;
  username?: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  gender: UserGenders;
  role: UserRoles;

  confirmEmailOtp?: string;
  resetPasswordOtp?: string;
  confirmedAt?: Date;
  changeCredentialsAt?: Date;
  updatedAt?: Date;
}
const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, minLength: 2, maxLength: 25 },
    middleName: { type: String, minLength: 2, maxLength: 25 },
    lastName: { type: String, required: true, minLength: 2, maxLength: 25 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    gender: { type: String, enum: UserGenders, default: UserGenders.male },
    role: { type: String, enum: UserRoles, default: UserRoles.user },

    confirmEmailOtp: { type: String },
    resetPasswordOtp: { type: String },
    confirmedAt: { type: Date },
    changeCredentialsAt: { type: Date },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
userSchema
  .virtual("username")
  .set(function (val: string) {
    const [firstName, lastName] = val.split(" ");
    this.set({ firstName, lastName });
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

export const User = models.User || model<IUser>("User", userSchema);
