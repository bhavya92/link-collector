import { Request, Response } from "express";
import {
  createUser,
  send_otp_to_email,
  user_validated,
  verify_otp,
} from "../services/user.js";
import {
  validate_email,
  validate_password,
  validate_username,
} from "../utils/input_validation.js";
import { hash_password } from "../utils/hash.js";
import { generate_jwt } from "../utils/jwt.js";

export const signup_verifyEmail = async (req: Request, res: Response) => {
  console.log("verify-email hitted");
  const email = req.body.email;
  const validate_email_res = await validate_email(email);
  console.log("validate_email_res", validate_email_res);
  if (!validate_email_res) {
    res.status(411).json({
      message: "Erros in Input",
    });
  }
  const send_otp_res = await send_otp_to_email(email);
  console.log("send_otp_res", send_otp_res);
  if (!send_otp_res) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
  res.status(200).send();
};

export const signup_verifyOtp = async (req: Request, res: Response) => {
  console.log("verify-otp hitted");
  const otp: string = req.body.otp;
  const email: string = req.body.email;
  const validate_email_res = await validate_email(email);
  console.log("validate_email_res", validate_email_res);
  if (!validate_email_res) {
    res.status(411).json({
      message: "Erros in Input",
    });
  }
  const verify_otp_res = await verify_otp(otp, email);
  console.log("verify_otp_res", verify_otp_res);
  if (!verify_otp_res) {
    res.status(401).json({
      message: "Invalid OTP",
    });
  } else {
    res.status(200).json({
      message: "OTP Verified",
    });
  }
};

export const signup_addNewUser = async (req: Request, res: Response) => {
  console.log("/signup/new hitted");
  const username: string = req.body.username;
  const email: string = req.body.email;
  const password: string = req.body.password;

  const user_validated_res = await user_validated(email);
  console.log("user_validated_res", user_validated_res);
  if (!user_validated_res) {
    res.status(401).json({
      message: "Bad Request",
    });
    return;
  }

  const validate_email_res = await validate_email(email);
  console.log("validate_email_res", validate_email_res);
  if (!validate_email_res) {
    res.status(411).json({
      message: "Erros in Input",
    });
    return;
  }

  const validate_username_res = await validate_username(username);
  console.log("validate_username_res", validate_username_res);
  if (!validate_username_res) {
    res.status(411).json({
      message: "Erros in Input",
    });
    return;
  }

  const validate_password_res = await validate_password(password);
  console.log("validate_password_res", validate_password_res);
  if (!validate_password_res) {
    res.status(411).json({
      message: "Erros in Input",
    });
    return;
  }

  const pass_hash = await hash_password(password);
  console.log("hash", pass_hash);
  if (pass_hash === "no_hash") {
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
  console.log("username", username);
  const create_user_res = await createUser(email, username, pass_hash);
  if (!create_user_res.sucess) {
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
  const userId = create_user_res.data!._id.toString();
  const jwt_token = generate_jwt(userId);
  // res.status(200)
  // .cookie("token", jwt_token, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "none",
  //   expires: new Date(Date.now() + 7 * 24 * 3600000),
  // })
  // .json({
  //   message: "Signup Success",
  //   email: create_user_res.data!.email,
  //   userName : create_user_res.data!.userName,
  // });
  res.status(200).json({
    message: "Signup Success",
    jwt: jwt_token,
  });
};

export const signup_loginUser = async (req: Request, res: Response) => {};

export const signup_logoutUser = async (req: Request, res: Response) => {};

export const signup_resetPassword = async (req: Request, res: Response) => {};
