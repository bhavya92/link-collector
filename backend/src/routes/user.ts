import { Router } from "express";
import {
  loginUser,
  logoutUser,
  resetPassword,
  resetPasswordRequest,
  resetTokenValidation,
  signup_addNewUser,
  signup_verifyEmail,
  signup_verifyOtp,
  validateToken,
} from "../controllers/user.js";
import { authenticated } from "../middlewares/authenticated.js";

const userRouter = Router();
//TODO : add a route to resend otp which is rate limited
userRouter.post("/signup/verify-email", signup_verifyEmail);

userRouter.post("/signup/verify-otp", signup_verifyOtp);

userRouter.post("/signup/new", signup_addNewUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout",authenticated,logoutUser);

userRouter.get("/reset-password-request",resetPasswordRequest); // TODO : add rate limiter

userRouter.get("/validate-reset-token",resetTokenValidation); // TODO :add rate limiter 

userRouter.post("/new-password", resetPassword);

userRouter.get("/validate-token", authenticated, validateToken);

export default userRouter;
