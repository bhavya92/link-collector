import SMTPTransport from "nodemailer/lib/smtp-transport";
import { createTransport } from "nodemailer";
import "dotenv/config";
import { appLogger } from "../utils/logger.js";

const transporter = createTransport({
  service: process.env.EMAIL_CLIENT,
  auth: {
    user: process.env.EMAIL_CLIENT_USERNAME,
    pass: process.env.EMAIL_CLIENT_PASSWORD,
  },
} as SMTPTransport.Options);

export const send_mail = async (
  to: string,
  subject: string,
  text: string,
  from: string | undefined = process.env.EMAIL_CLIENT_USERNAME,
) => {
  const mailOptions = {
    from,
    to,
    subject,
    text,
  };
  const success = true;
  try {
    const mail_response = await transporter.sendMail(mailOptions);
    appLogger.info(`Mail sent to ${from}->${to}, SUB : ${subject}`);
    appLogger.info(mail_response);
    return success;
  } catch (err) {
    appLogger.error(`Error Sending Mail ${err}`);
    return !success;
  }
};
