import Redis from "ioredis";

const redis = new Redis(process.env.NEXT_PUBLIC_REDIS_URL || "redis");

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));
export default redis;
