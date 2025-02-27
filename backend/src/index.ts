import "dotenv/config";
import { connectMongoDb } from "./config/mongo.js";
import express, { Express } from "express";
import indexRouter from "./routes/index.js";

const app: Express = express();

app.use(express.json());
app.use("/api/v1", indexRouter);

const main = async (): Promise<void> => {
  console.log("Inside main");
  try {
    await connectMongoDb();
    app.listen(process.env.PORT, () => {
      console.log(
        `[server]: Server is running at http://localhost:${process.env.PORT}`,
      );
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();
