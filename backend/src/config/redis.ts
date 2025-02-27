import { createClient, RedisClientType } from "redis";
import "dotenv/config";

const redisClient: RedisClientType = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on("connect", () => {
  console.log("Redis Connected Successfully");
});

redisClient.on("ready", () => {
  console.log("Redis client is ready to use.");
});

redisClient.on("error", (err) => {
  console.log("Redis connection error.", err);
});

redisClient.on("end", () => {
  console.log("Redis client disconnected.");
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
    console.log(`Stored "${key}":`, value);
    return true;
  } catch (err) {
    console.log("Error setting key", err);
    return false;
  }
}

export async function getData(key: string) {
  try {
    const value = await redisClient.get(key);
    console.log(`Got "${key}":`, value);
    return value;
  } catch (err) {
    console.log("Error getting key", err);
    return 0;
  }
}
