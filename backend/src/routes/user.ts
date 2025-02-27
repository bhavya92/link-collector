import { Router } from "express";
import {
  loginUser,
  logoutUser,
  signup_addNewUser,
  signup_verifyEmail,
  signup_verifyOtp,
} from "../controllers/user.js";
import { authenticated } from "../middlewares/authenticated.js";

const userRouter = Router();

userRouter.post("/signup/verify-email", signup_verifyEmail);

userRouter.post("/signup/verify-otp", signup_verifyOtp);

userRouter.post("/signup/new", signup_addNewUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout",authenticated,logoutUser);

export default userRouter;
