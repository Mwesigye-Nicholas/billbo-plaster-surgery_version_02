import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
        user?: UserPayload;
      files?: Multer.File[];
    }
    interface UserPayload {
      sub: string;
      role: string;
      email: string;
      name: string;
    }
  }
}
export {}