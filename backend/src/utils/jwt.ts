import jwt from "jsonwebtoken";
import "dotenv/config";
import { appLogger } from "./logger.js";

export const generate_jwt = (id: string): string => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET!);
  return token;
};

export const verify_jwt = (token: string) => {
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch(err) {
    appLogger.error(`Error decoding ${token} jwt ${err}`);
    return null;
  }
  
};
