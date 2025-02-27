import { Router } from "express";
import {
  signup_addNewUser,
  signup_verifyEmail,
  signup_verifyOtp,
} from "../controllers/user.js";

const userRouter = Router();

userRouter.post("/signup/verify-email", signup_verifyEmail);

userRouter.post("/signup/verify-otp", signup_verifyOtp);

userRouter.post("/signup/new", signup_addNewUser);

export default userRouter;
