import { randomUUID } from "crypto";
import { REFRESH_TOKEN_SECRET_KEY } from "../config/env.js";
import jwt from "jsonwebtoken";
import type { BaseTokenPayload, RefreshTokenPayload } from "../types/express/tokenPayload.js";

const refreshTokenGenerator = (payload: BaseTokenPayload): string => {
  const fullPayload: RefreshTokenPayload = {
   ...payload, jti: randomUUID()
 }
  return jwt.sign(fullPayload, REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: "10d",
  });
};
export default refreshTokenGenerator;
