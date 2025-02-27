import { createClient, RedisClientType } from "redis";
import "dotenv/config";
import { appLogger } from "../utils/logger.js";

const redisClient: RedisClientType = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on("connect", () => {
  appLogger.info("Redis Connected Successfully");
});

redisClient.on("ready", () => {
  appLogger.info("Redis client is ready to use.");
});

redisClient.on("error", (err) => {
  appLogger.error(`Redis Connection error : ${err}`);
});

redisClient.on("end", () => {
  appLogger.info("Redis client disconnected.");
});

async function connect_redis() {
  await redisClient.connect();
}

connect_redis();

export async function setData(key: string, value: object, expiration = 300) {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: expiration,
    });
    appLogger.info(`Stored "${key}": ${value}`);
    return true;
  } catch (err) {
    appLogger.error(`Error setting key ${err}`);
    return false;
  }
}

export async function getData(key: string) {
  try {
    const value = await redisClient.get(key);
    appLogger.info(`Got "${key}": ${value}`);
    return value;
  } catch (err) {
    appLogger.error(`Error getting key ${err}`);
    return 0;
  }
}
