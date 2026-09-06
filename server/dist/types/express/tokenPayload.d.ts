import { type JwtPayload } from "jsonwebtoken";
export interface BaseTokenPayload extends JwtPayload {
    sub: string;
    name: string;
    email: string;
    role: "surgeon" | "admin" | "assistant";
}
export interface RefreshTokenPayload extends BaseTokenPayload {
    jti: string;
}
//# sourceMappingURL=tokenPayload.d.ts.map