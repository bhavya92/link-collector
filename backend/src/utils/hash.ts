import bcrypt from "bcrypt";
import "dotenv/config";

export const hash_password = async (password: string) => {
  try {
    const hash = bcrypt.hash(password, parseInt(process.env.HASH_SALT_ROUNDS!));
    return hash;
  } catch (err) {
    console.error(err);
    return "no_hash";
  }
};
