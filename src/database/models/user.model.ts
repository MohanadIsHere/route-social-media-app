import { Schema, models, model, type HydratedDocument, Types } from "mongoose";
import { hashText } from "../../utils/security/hash";
import { encryptText } from "../../utils/security/encryption";
import { APP_EMAIL, APP_NAME } from "../../config/env";
import { emailTemplates } from "../../utils/templates";
import { otpGen } from "../../utils/events/email.events";
import { emailEvents } from "../../utils/events/eventEmitter";

export enum UserGenders {
  male = "male",
  female = "female",
}
export enum UserRoles {
  user = "user",
  admin = "admin",
  superAdmin = "superAdmin"
}
export enum UserProviders {
  system = "system",
  google = "google",
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
  gender: UserGenders;
  role: UserRoles;
  provider?: string;
  profileImage?: string;
  tmpProfileImage?: string;
  friends?: Types.ObjectId[];

  coverImages?: Array<string>;
  confirmEmailOtp?: string;
  otpExpiresIn?: Date;
  resetPasswordOtp?: string;
  confirmedAt?: Date;
  changeCredentialsAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  freezedAt?: Date;
}
const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, minLength: 2, maxLength: 25 },
    middleName: { type: String, minLength: 2, maxLength: 25 },
    lastName: { type: String, required: true, minLength: 2, maxLength: 25 },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return this.provider === UserProviders.google ? false : true;
      },
    },
    phone: { type: String },
    address: { type: String },
    gender: { type: String, enum: UserGenders, default: UserGenders.male },
    role: { type: String, enum: UserRoles, default: UserRoles.user },
    confirmed: { type: Boolean },
    profileImage: { type: String },
    tmpProfileImage: { type: String },
    otpExpiresIn: { type: Date },
    coverImages: [String],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],

    provider: {
      type: String,
      enum: UserProviders,
      default: UserProviders.system,
    },

    confirmEmailOtp: { type: String },
    resetPasswordOtp: { type: String },
    confirmedAt: { type: Date },
    changeCredentialsAt: { type: Date },
    freezedAt: { type: Date },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    strictQuery: true,
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

userSchema.pre("save", async function (next) {
  if (
    this.isModified("password") &&
    this.password &&
    this.provider !== UserProviders.google
  ) {
    this.password = await hashText({
      plainText: this.password,
    });
  }

  if (this.isModified("phone") && this.phone) {
    this.phone = encryptText({ cipherText: this.phone });
  }

  if (this.isNew && !this.confirmed && this.provider !== UserProviders.google) {
    plainOtp = otpGen();
    this.confirmEmailOtp = await hashText({ plainText: plainOtp });
  }

  next();
});
let plainOtp: string | null = "";

userSchema.post("save", function (doc) {
  if (!doc.confirmed && doc.provider !== UserProviders.google && plainOtp) {
    emailEvents.emit("sendEmail", {
      from: `"${APP_NAME}" <${APP_EMAIL}>`,
      to: doc.email,
      subject: "Email Verification",
      text: "Please verify your email address.",
      html: emailTemplates.verifyEmail({
        otp: plainOtp,
        firstName: doc.firstName,
      }),
    });

    plainOtp = null;
  }
});


export const userModel = models.User || model<IUser>("User", userSchema);
export type HydratedUserDoc = HydratedDocument<IUser>;
