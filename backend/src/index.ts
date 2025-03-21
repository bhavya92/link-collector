import "dotenv/config";
import { connectMongoDb } from "./config/mongo.js";
import express, { Express } from "express";
import indexRouter from "./routes/index.js";
import { appLogger } from "./utils/logger.js";
import { httpLoggerMiddleware } from "./middlewares/httpLogger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from 'cors'
import cookieParser from "cookie-parser";


const app: Express = express();

app.use(cookieParser())
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(httpLoggerMiddleware);
app.use("/api/v1", indexRouter);
app.use(errorHandler);

const main = async (): Promise<void> => {
  console.log("Inside main");
  try {
    await connectMongoDb();
    app.listen(process.env.PORT, () => {
      appLogger.info(`Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();
