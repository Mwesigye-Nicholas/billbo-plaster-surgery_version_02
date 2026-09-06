import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET_KEY  } from "../config/env.js";


interface TokenPayload {
  sub: string;
  name: string;
  email: string;
  role: "surgeon" | "admin" | "assistant";
}

const accessTokenGenerator = (payload: TokenPayload): string => {
  return jwt.sign(
    { ...payload },
    ACCESS_TOKEN_SECRET_KEY ,
    { expiresIn: "45m" }
  );
};

export default accessTokenGenerator;
