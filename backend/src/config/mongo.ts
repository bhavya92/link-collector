import mongoose from "mongoose";
import "dotenv/config";
import { appLogger } from "../utils/logger.js";

export const connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    appLogger.info("Connected to MongoDb");
    return 1;
  } catch (err) {
    appLogger.error(err);
    process.exit(1);
  }
};
