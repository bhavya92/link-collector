import { Router } from "express";
import userRouter from "./user.js";
import contentRouter from "./content.js";

const indexRouter = Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/content",contentRouter);
export default indexRouter;
