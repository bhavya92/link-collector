import { Router } from "express";
import userRouter from "./user.js";

const indexRouter = Router();

indexRouter.use("/user", userRouter);

export default indexRouter;
