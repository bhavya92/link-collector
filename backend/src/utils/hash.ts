import bcrypt from "bcrypt";
import "dotenv/config";
import { appLogger } from "./logger.js";

export const hash_password = async (password: string) => {
  try {
    const hash = bcrypt.hash(password, parseInt(process.env.HASH_SALT_ROUNDS!));
    appLogger.info(`Hash generation succesfull in hash_password`);
    return hash;
  } catch (err) {
    appLogger.error(`Erro creating hash ${err}`);
    return "no_hash";
  }
};
