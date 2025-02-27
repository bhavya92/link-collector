import morgan from "morgan";
import { httpLogger } from "../utils/logger.js";

export const httpLoggerMiddleware = morgan(
    `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":referrer" ":user-agent"`,
    {
        stream: {
            write: (message: string) => httpLogger.http(message.trim()),
        },
    }
);