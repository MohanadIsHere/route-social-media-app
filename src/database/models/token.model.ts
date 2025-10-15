import { HydratedDocument, model, models, Schema, Types } from "mongoose";

export interface IToken{
  jti: string;
  expiresIn: number;
  userId: Types.ObjectId
}
const tokenSchema = new Schema(
  {
    jti: { type: String, required: true, unique: true },
    expiresIn: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);
export const tokenModel = models.Token || model<IToken>("Token", tokenSchema)
export type HydratedTokenDoc = HydratedDocument<IToken>