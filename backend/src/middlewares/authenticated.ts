import { NextFunction, Request, Response } from "express";
import { verify_jwt } from "../utils/jwt.js";
import { appLogger } from "../utils/logger.js";
import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
    userId: string | JwtPayload;
   }

export const authenticated = async (req: Request, res: Response, next: NextFunction) => {
    appLogger.info("auth middleware hitted");
    const token = req.cookies.token;
    if(!token) {
        res.status(400).json({
            message:"Please Login First"
        });
        return;
    }
    const decoded = verify_jwt(token);
    if(decoded) {
        (req as CustomRequest).userId = decoded;
        next();
    } else {
        res.status(401).json({
            message:"Unauthorized"
        });
    }
}