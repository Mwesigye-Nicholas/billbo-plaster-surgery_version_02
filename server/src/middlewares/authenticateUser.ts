import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import type { Request, Response, NextFunction } from "express";
import { ACCESS_TOKEN_SECRET_KEY} from "../config/env.js";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("UnAuthorized access, denied", 401));
  }
  const accessToken = authHeader?.split(" ")[1];

  if (!accessToken) {
    return next(new AppError("AccessToken required", 401));
  }

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET_KEY) ;

    if (typeof decoded === "string") {
      return next(new AppError("Invalid token payload", 403))
    }
    
    req.user = decoded as Express.UserPayload;// assign to req.user
    
    next();
  } catch (error: any) {
    
   if (error.name === "TokenExpiredError") {
    return next(new AppError("Access token expired", 401));
  } else if (error.name === "JsonWebTokenError") {
    return next(new AppError("Invalid access token", 401));
  }
  return next(new AppError("Internal Server Error", 500));
}
};

export default authenticateToken;
