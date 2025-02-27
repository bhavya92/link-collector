import { model, Schema, Types } from "mongoose";

const schema = new Schema({
  hash: { type: String, required: true },
  userId: { type: Types.ObjectId, ref: "users", required: true },
});

export const LinkModel = model("links", schema);
