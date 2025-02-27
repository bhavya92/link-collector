import { model, Schema, Types } from "mongoose";

const schema = new Schema({
  hash: { type: String, required: true },
  userId: { type: Types.ObjectId, ref: "User", required: true },
});

export const LinkModel = model("Links", schema);
