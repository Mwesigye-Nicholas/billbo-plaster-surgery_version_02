import { Redis } from "ioredis";
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6380";
const redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null, // Prevents request crashes
    enableReadyCheck: false, // Ensures server is ready
});
redis.on("connect", () => {
    console.log("✅ Redis Server Connection successful.");
});
redis.on("ready", () => {
    console.log("Ready to receive tcp requests");
});
redis.on("error", (error) => {
    console.log("❌ Failed to connect Redis Server:", error);
});
export default redis;
//# sourceMappingURL=redisClient.js.map