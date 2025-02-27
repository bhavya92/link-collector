import winston from "winston";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logFormat = winston.format.printf( ({timestamp, level, message}) => {
    return `${timestamp} [${level.toUpperCase()}] : ${message}`;
});

export const appLogger = winston.createLogger({
    level:"debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        logFormat
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, "../../logs/application.log"),
            level: "info",
        }),
        new winston.transports.File({
            filename: path.join(__dirname,"../../logs/error.log"),
            level: "error",
        }),
        new winston.transports.Console(),
    ],
});

export const httpLogger = winston.createLogger({
    level: "http",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        logFormat
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, "../../logs/http.log"),
            level:"http",
        }),
    ],
});
