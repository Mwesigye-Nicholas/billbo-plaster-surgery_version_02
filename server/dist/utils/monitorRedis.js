import redis from "../config/redisClient.js";
import AppError from "./appError.js";
const TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days
const monitorRedis = async (jti) => {
    try {
        const key = `bl:${jti}`;
        const isBlackListed = await redis.exists(key);
        if (isBlackListed === 1) {
            throw new AppError("Unauthorized access, invalid Refresh Token", 401);
        }
        return await redis.set(key, "1", "EX", TOKEN_TTL);
    }
    catch (error) {
        throw error instanceof AppError
            ? error
            : new AppError("Internal Server Error", 500);
    }
};
export default monitorRedis;
//# sourceMappingURL=monitorRedis.js.map