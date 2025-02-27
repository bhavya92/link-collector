import { model, Schema } from "mongoose";

const schema = new Schema({
  title: { type: String, required: true, unique: true },
});

export const TagModel = model("tags", schema);
