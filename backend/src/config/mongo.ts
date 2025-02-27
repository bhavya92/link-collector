import mongoose from "mongoose";
import "dotenv/config";

export const connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to MongoDb");
    return 1;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
