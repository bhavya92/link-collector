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
import { appLogger } from "../utils/logger.js";

export const signup_verifyEmail = async (req: Request, res: Response) => {
  appLogger.info("/signup/verify-email hitted");
  const email = req.body.email;
  
  const validate_email_res = await validate_email(email); 
  if (!validate_email_res) {
    appLogger.warn(`Failed ${email} input validation `);
    res.status(411).json({
      message: "Erros in Input",
    });
    return;
  }
  appLogger.info(`${email} input validation ${validate_email_res}`);

  const send_otp_res = await send_otp_to_email(email);
  if (!send_otp_res) {
    appLogger.error(`Failed to send otp to ${email} send_otp_res ${send_otp_res}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
  appLogger.info(`Otp send to ${email}`);
  res.status(200).send();
};

export const signup_verifyOtp = async (req: Request, res: Response) => {
  appLogger.info("verify-otp hitted");
  const otp: string = req.body.otp;
  const email: string = req.body.email;

  const validate_email_res = await validate_email(email);
  if (!validate_email_res) {
    appLogger.warn(`Failed ${email} input validation `);
    res.status(411).json({
      message: "Erros in Input",
    });
    return;
  }
  appLogger.info(`${email} input validation succesfull`);

  const verify_otp_res = await verify_otp(otp, email);
  console.log("verify_otp_res", verify_otp_res);
  if (!verify_otp_res) {
    appLogger.warn(`wrong otp by ${email}`);
    res.status(401).json({
      message: "Invalid OTP",
    });
    return; 
  } else {
    appLogger.info(`otp verified for ${email}`);
    res.status(200).json({
      message: "OTP Verified",
    });
    return;
  }
};

export const signup_addNewUser = async (req: Request, res: Response) => {
  appLogger.info("/signup/newUser hitted");
  const username: string = req.body.username;
  const email: string = req.body.email;
  const password: string = req.body.password;

  const user_validated_res = await user_validated(email);

  if (!user_validated_res) {
    appLogger.warn(`/signup/newUser hitted without otp verification by email: ${email}`);
    res.status(401).json({
      message: "Bad Request",
    });
    return;
  }
  appLogger.info(`${email} is validated`);

  const validate_email_res = await validate_email(email);
  if (!validate_email_res) {
    appLogger.warn(`Failed ${email} input validation `);
    res.status(411).json({
      message: "Erros in Input",
    });
    return;
  }
  appLogger.info(`${email} input validation succesfull`);

  const validate_username_res = await validate_username(username);
  if (!validate_username_res) {
    appLogger.warn(`Failed ${username} input validation ${email}`);
    res.status(411).json({
      message: "Erros in Input",
    });
    return;
  }
  appLogger.info(`${username} input validation succesfull for ${email}`);

  const validate_password_res = await validate_password(password);
  if (!validate_password_res) {
    appLogger.warn(`Failed Password input validation ${email}`);
    res.status(411).json({
      message: "Erros in Input",
    });
    return;
  }
  appLogger.info(`Password input validation succesfull for ${email}`);

  const pass_hash = await hash_password(password);
  if (pass_hash === "no_hash") {
    appLogger.error(`Error generating hash for ${email}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
  appLogger.info(`hash generation successful for ${email} password`);

  const create_user_res = await createUser(email, username, pass_hash);
  if (!create_user_res.sucess) {
    appLogger.error(`Error creating new user ${email}`);
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
