import SMTPTransport from "nodemailer/lib/smtp-transport";
import { createTransport } from "nodemailer";
import "dotenv/config";

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
  let success = true;
  try {
    let mail_response = await transporter.sendMail(mailOptions);
    console.log("mail_response", mail_response);
    return success;
  } catch (err) {
    console.error("Error Sending Mail", err);
    return !success;
  }
};
