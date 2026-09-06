import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET_KEY } from "../../config/env.js";
import AppError from "../../utils/appError.js";
import accessTokenGenerator from "../../utils/accessTokenGenerator.js";
import redis from "../../config/redisClient.js";
const refreshTokenController = async (req, res, next) => {
    const token = req.cookies.refreshToken;
    console.log("Refresh Token: ", token);
    if (!token) {
        return next(new AppError("Unauthorized Access", 401));
    }
    //const key = `bl:${token}`;
    try {
        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET_KEY);
        console.log("Decoded", decoded);
        const key = `bl:${decoded.jti}`;
        console.log("Key: ", key);
        console.log("Before isBlackListed");
        const isBlackListed = await redis.exists(key);
        console.log("After isBlackListed");
        console.log("Is blacklisted: ", isBlackListed);
        if (isBlackListed === 1) {
            return next(new AppError("Refresh Token is blacklisted", 401));
        }
        const newAccessToken = accessTokenGenerator({
            sub: decoded.sub,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
        });
        console.log("New access Token: ", newAccessToken);
        return res.status(200).json({
            success: true,
            accessToken: newAccessToken,
        });
    }
    catch (error) {
        return next(error instanceof AppError
            ? error
            : new AppError("Invalid or expired refresh token", 401));
    }
};
export default refreshTokenController;
//# sourceMappingURL=refreshTokenController.js.map