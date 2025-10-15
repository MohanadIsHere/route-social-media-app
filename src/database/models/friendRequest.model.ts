import { HydratedDocument, model, models, Schema, Types } from "mongoose";



export interface IFriendRequest {
  createdBy: Types.ObjectId;
  sendTo?: Types.ObjectId;
  acceptedAt?: Date;
  rejectedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
export type HydratedFriendRequestDoc = HydratedDocument<IFriendRequest>;
const friendRequestSchema = new Schema<IFriendRequest>(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sendTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    acceptedAt: { type: Date },
    rejectedAt: { type: Date },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);



friendRequestSchema.pre(["find", "findOne","countDocuments"], async function (next) {
  const query = this.getQuery();
  if (query.paranoId === false) {
    this.setQuery({ ...query });
  } else {
    this.setQuery({ ...query, freezedAt: { $exists: false } });
  }
  next();
});
friendRequestSchema.pre(["findOneAndUpdate", "updateOne"], async function (next) {
  const query = this.getQuery();
  if (query.paranoId === false) {
    this.setQuery({ ...query });
  } else {
    this.setQuery({ ...query, freezedAt: { $exists: false } });
  }
  next();
});
export const friendRequestModel = models.FriendRequest || model<IFriendRequest>("FriendRequest", friendRequestSchema);
