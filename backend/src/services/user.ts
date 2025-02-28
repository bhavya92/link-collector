import { delData, getData, setData } from "../config/redis.js";
import { generate_otp } from "../utils/otp.js";
import "dotenv/config";
import { send_mail } from "./mailer.js";
import { UserModel } from "../models/users.js";
import { appLogger } from "../utils/logger.js";
import crypto from "crypto";
import { comapre_hash, hash_password } from "../utils/hash.js";

export const send_otp_to_email = async (email: string) => {
  const otp: number = generate_otp();
  const value = {
    otp_in_db: otp,
    validated: false,
  };
  const result = await setData(`otp:${email}`, value);
  if (!result) {
    return result;
  }
  const email_body = "Your OTP is " + otp;
  const email_subject = "OTP for email verification.";
  const send_mail_res = await send_mail(email, email_subject, email_body);
  return send_mail_res;
};

export const verify_otp = async (otp: string, email: string) => {
  const value = await getData(`otp:${email}`);
  const success = true;
  if (value === 0) {
    return !success;
  }
  const { otp_in_db } = JSON.parse(value!);
  if (otp_in_db.toString() === otp.toString()) {
    appLogger.info(`OTP in REDIS ${otp_in_db} MATCHES OTP CAME IN VERIFY_OTP ${otp}`);
    const updated_value = {
      otp_in_db: otp,
      validated: true,
    };
    const set_data_res = await setData(email, updated_value, 500);
    if (set_data_res) return success;
    else return !success;
  } else {
    appLogger.warn(`OTP in REDIS ${otp_in_db} doesn't MATCHES OTP CAME IN VERIFY_OTP ${otp}`);
    return !success;
  }
};

export const user_validated = async (email: string) => {
  const value = await getData(email);
  if (value === 0 || value === null) return false;
  const { validated } = JSON.parse(value!);
  return validated;
};

export const createUser = async (
  email: string,
  username: string,
  pass: string,
) => {
  try {
    const userData = await UserModel.create({
      userName: username,
      email: email,
      password: pass,
    });
    return {
      sucess: true,
      data: userData,
    };
  } catch (err) {
    appLogger.error(`Error creating ${email} : ${err}`);
    return {
      sucess: false,
      data: null,
    };
  }
};

export const checkUserExist = async(uniqueId : string) => {
  try {
    const userFound = await UserModel.findOne(
      {
        $or : [
          {email : uniqueId},
          {userName : uniqueId},
        ]
      }
    ).lean();
    if(userFound === null) {
      appLogger.info(`${uniqueId} doesn't exist`);
    } else {
      appLogger.info(`${uniqueId} found`);
    }
    return {
      userFound,
      sucess : true,
    }
  } catch(err) {
    appLogger.error(err);
    return {
      userFound : null,
      sucess : false,
    }
  }
};

export const generate_link = async(email: string) => {
  try {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await hash_password(resetToken);
    
    if(hashedToken === 'no_hash')
      throw new Error(`Error generating hash`)

    const result = await setData(`token:${email}`,{hashedToken},900);
    if(!result)
      throw new Error(`Error setting data to redis`)

    const resetLink = `http:localhost:300/user/validate-reset-token?token=${resetToken}&email=${email}`;
    const email_body = `Click on this link to reset password : ${resetLink}`;
    const email_subject = `Password Change Request`;
    const send_mail_res = await send_mail(email, email_subject, email_body);

    if(!send_mail_res) {
      const deleted_token = await delData(`token:${email}`);
      if(!deleted_token)
        throw new Error(`Error deleting token of ${email}`);
      throw new Error(`Error sending password change mail to ${email}`);
    }
      
    return true;
  } catch(err) {
    appLogger.error(`${email} : ${err}`);
    return false;
  }
};

export const validate_reset_token = async(email:string, token: string) => {
  try {
    const value = await getData(`token:${email}`);
    if(value === 0)
      throw new Error(`Error getting data for ${email} for token validation`);
    const {hashed_token} = JSON.parse(value!);
    
    const hash_compare_res = await comapre_hash(token, hashed_token);
    if(!hash_compare_res)
      throw new Error(`Hash checking error or wrong token`);

    return true;
  } catch(err) {
    appLogger.error(err);
    return false;
  }
}

export const update_user_password = async(email: string, hash: string) => {
  try{
    await UserModel.findOneAndUpdate({
      email: email
    }, {
      password:hash
    });
    return true;
  } catch(err) {
    appLogger.error(`Error updating ${email} password ${err}`);
    return false;
  } finally {
    const email_subject = "Password Changed!";
    const email_body = "Password Updated succesfully.";
    const send_mail_res = await send_mail(email, email_subject, email_body);
    if(!send_mail_res)
      appLogger.error(`Failed to send password change mail to ${email}`);
  }
}