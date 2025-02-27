import { Schema, model } from "mongoose";

const schema = new Schema({
  userName: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
});

export const UserModel = model("users", schema);
