import { Request, Response, NextFunction } from "express";
import { appLogger } from "../utils/logger.js";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    appLogger.error(`Unhandled Error: ${err}`);
    res.status(500).json({
        message: "Internal Server Error",
    });
};

