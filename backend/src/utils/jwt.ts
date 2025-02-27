import jwt from "jsonwebtoken";
import "dotenv/config";

export const generate_jwt = (id: string): string => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET!);
  return token;
};

export const verify_jwt = () => {};
