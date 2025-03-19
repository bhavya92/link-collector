import { Request, Response } from "express";
import {
  checkUserExist,
  createUser,
  generate_link,
  send_otp_to_email,
  update_user_password,
  user_validated,
  validate_reset_token,
  verify_otp,
} from "../services/user.js";
import {
  validate_email,
  validate_password,
  validate_username,
} from "../utils/input_validation.js";
import { comapre_hash, hash_password } from "../utils/hash.js";
import { generate_jwt } from "../utils/jwt.js";
import { appLogger } from "../utils/logger.js";
import { CustomRequest } from "../middlewares/authenticated.js";

interface ResetTokenValidation {
  token?: string;
  email?: string;
}
export const signup_verifyEmail = async (req: Request, res: Response) => {
  appLogger.info("/signup/verify-email hitted");
  const email = req.body.email;
  const user_exist_res = await checkUserExist(email);
  if(user_exist_res) {
    appLogger.warn(`${email} requested signup but exists`);
    res.status(403).json({
      message: "Email already exist",
    })
    return;
  }

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
  res.status(200).json({
    message: "Otp sent succesfully"
  });
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
  res.status(200)
  .cookie("token", jwt_token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now() + 7 * 24 * 3600000),
  })
  .json({
    message: "Signup Success",
    email: create_user_res.data!.email,
    userName : create_user_res.data!.userName,
  });
  // res.status(200).json({
  //   message: "Signup Success",
  //   jwt: jwt_token,
  // });
};

export const loginUser = async (req: Request, res: Response) => {
  appLogger.info(`/login hitted`);
  const uniqueId = req.body.uniqueId;
  const password = req.body.password;

  const user_exist_res = await checkUserExist(uniqueId);
  if(!user_exist_res) {
    appLogger.warn(`${uniqueId} requested login but doesn't exist`);
    res.status(400).json({
      message: "Email or Username not found",
    })
    return;
  }

  const comapre_hash_res = await comapre_hash(password,user_exist_res!.password);
  if(!comapre_hash_res) {
    appLogger.warn(`Password Incorrect for ${uniqueId}`);
    res.status(403).json({
      message:"Incorrect Credentials",
    });
    return;
  }

  const userId = user_exist_res!._id.toString();
  const jwt_token = generate_jwt(userId);
  appLogger.info(`${uniqueId} login success`) 
  res.status(200)
  .cookie("token", jwt_token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now() + 7 * 24 * 3600000),
  })
  .json({
    message: "Signup Success",
    email: user_exist_res!.email,
    userName : user_exist_res!.userName,
  });
   
  // res.status(200).json({
  //   message:"Success Login",
  //   jwt: jwt_token,
  // });
};

export const logoutUser = async (req: Request, res: Response) => {
  const userId = (req as CustomRequest).userId;
  appLogger.info(`logging out ${userId}`);
  res
  .status(200)
  .cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  })
  .json({
    message: "User logeged out",
  });
};

export const resetPasswordRequest = async (req: Request, res: Response) => {
  appLogger.info(`resetPasswordRequest hitted`);
  const email = req.body.email;
  if(!email){
    appLogger.warn(`${email} not provided`);
    res.status(400).json({
      message:"Invalid, please send email"
    })
    return;
  }
  
  const validate_email_res = await validate_email(email); 
  if (!validate_email_res) {
    appLogger.warn(`Failed ${email} input validation `);
    res.status(411).json({
      message: "Erros in Input",
    });
    return;
  }
  appLogger.info(`${email} input validation ${validate_email_res}`);

  const user_exist_res = await checkUserExist(email);
  if(!user_exist_res) {
    appLogger.warn(`${email} requested password reset but doesn't exist`);
    res.status(404).json({
      message: "Email not found",
    })
    return;
  }
  appLogger.info(`${email} exists in db`);

  const generate_link_res = await generate_link(email);
  if(!generate_link_res){
    res.status(500).json({
      message:'Error generating/sending mail'
    })
  }
  res.status(200).json({
    message:"password reset link send",
  });
};

export const resetTokenValidation = async(req: Request<object,object,object,ResetTokenValidation>, res: Response) => {
  const {token, email} = req.query;
  appLogger.info(`/validate-reset-token hitted`);
  if(email === undefined || token === undefined){
    res.status(401).json({
      message:"Invalid Link"
    });
  }

  const validate_email_res = await validate_email(email!); 
  if (!validate_email_res) {
    appLogger.warn(`Failed ${email} input validation `);
    res.status(411).json({
      message: "Invalid Email",
    });
    return;
  }
  appLogger.info(`${email} input validation ${validate_email_res}`);

  const user_exist_res = await checkUserExist(email!);
  if(!user_exist_res) {
    appLogger.warn(`${email} requested resetTokenValidation but doesn't exist`);
    res.status(400).json({
      message: "Email or Username not found",
    })
    return;
  }
  appLogger.info(`User ${email} exist in DB`);

  const validate_token_res = await validate_reset_token(email!, token!);
  if(validate_token_res){
    appLogger.info(`Pass reset token validated for ${email}`);
    res.status(200).json({
      message:"Token is Valid"
    });
  } else {
    res.status(400).json({
      messsage:"Invalid or Expired token"
    });
  }
}

export const resetPassword = async(req: Request, res: Response) => {
  const email = req.body.email;
  const newPassword = req.body.password;
  const passwordResetToken = req.body.token;

  const user_exist_res = await checkUserExist(email);
  if(!user_exist_res) {
    appLogger.warn(`${email} requested password change but doesn't exist`);
    res.status(400).json({
      message: "Email not found, kindly redo password reset",
    })
    return;
  }

  const validate_token_res = await validate_reset_token(email!, passwordResetToken!);
  if(!validate_token_res){
    appLogger.warn(`Pass reset token validated for ${email}`);
    res.status(400).json({
      messsage:"Invalid or Expired token"
    });
    return;
  } 

  const validate_password_res = await validate_password(newPassword);
  if (!validate_password_res) {
    appLogger.warn(`Failed Password input validation ${email}`);
    res.status(411).json({
      message: "Erros in Input",
    });
    return;
  }
  appLogger.info(`Password input validation succesfull for ${email}`);

  const pass_hash = await hash_password(newPassword);
  if (pass_hash === "no_hash") {
    appLogger.error(`Error generating hash for ${email}`);
    res.status(500).json({
      message: "Internal Server Error",
    });
    return;
  }
  appLogger.info(`hash generation successful for ${email} password`);

  const update_pass_res = await update_user_password(email, pass_hash);
  if(!update_pass_res){
    res.status(500).json({
      message:"Error updaing Password"
    });
    return;
  }
  appLogger.info(`Password updated of ${email}`);
  res.status(200).json({
    message:"Password updated Succesfully",
  });
}