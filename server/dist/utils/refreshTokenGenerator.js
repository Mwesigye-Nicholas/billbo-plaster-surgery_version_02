import { randomUUID } from "crypto";
import { REFRESH_TOKEN_SECRET_KEY } from "../config/env.js";
import jwt from "jsonwebtoken";
const refreshTokenGenerator = (payload) => {
    const fullPayload = {
        ...payload, jti: randomUUID()
    };
    return jwt.sign(fullPayload, REFRESH_TOKEN_SECRET_KEY, {
        expiresIn: "10d",
    });
};
export default refreshTokenGenerator;
//# sourceMappingURL=refreshTokenGenerator.js.map