import { Schema, models, model } from "mongoose";

export enum UserGenders {
  male = "male",
  female = "female",
}
export enum UserRoles {
  user = "user",
  admin = "admin",
}
export interface IUser {
  firstName: string;
  middleName?: string;
  lastName: string;
  username?: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  confirmed?: boolean;
  otp?: string;
  gender: UserGenders;
  role: UserRoles;

  confirmEmailOtp?: string;
  resetPasswordOtp?: string;
  confirmedAt?: Date;
  changeCredentialsAt?: Date;
  createdAt?: Date;
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
    confirmed: { type: Boolean },
    otp: { type: String },

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
    const [firstName, middleName, lastName] = val.split(" ");
    if (middleName) this.set({ firstName, middleName, lastName });
    else this.set({ firstName, lastName });
  })
  .get(function () {
    return this.middleName
      ? `${this.firstName} ${this.middleName} ${this.lastName}`
      : `${this.firstName} ${this.lastName}`;
  });

export const User = models.User || model<IUser>("User", userSchema);
