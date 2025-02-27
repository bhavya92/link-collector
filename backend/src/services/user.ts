import { getData, setData } from "../config/redis.js";
import { generate_otp } from "../utils/otp.js";
import "dotenv/config";
import { send_mail } from "./mailer.js";
import { UserModel } from "../models/users.js";
import { appLogger } from "../utils/logger.js";

export const send_otp_to_email = async (email: string) => {
  const otp: number = generate_otp();
  const value = {
    otp_in_db: otp,
    validated: false,
  };
  const result = await setData(email, value);
  if (!result) {
    return result;
  }
  const email_body = "Your OTP is " + otp;
  const email_subject = "OTP for email verification.";
  const send_mail_res = await send_mail(email, email_subject, email_body);
  return send_mail_res;
};

export const verify_otp = async (otp: string, email: string) => {
  const value = await getData(email);
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
