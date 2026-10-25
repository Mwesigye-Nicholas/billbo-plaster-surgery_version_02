import  { type JwtPayload } from "jsonwebtoken";


export interface BaseTokenPayload extends  JwtPayload {
    sub: string;
  name: string;
  email: string;
  role: "surgeon" | "nurse" | "doctor" | "admin";
}
export interface RefreshTokenPayload extends BaseTokenPayload {
 
  jti: string;
}
