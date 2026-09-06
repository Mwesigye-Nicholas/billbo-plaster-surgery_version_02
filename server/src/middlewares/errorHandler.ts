import type { Request, Response, NextFunction } from "express";
import { NODE_ENV } from "../config/env.js";
import AppError from "../utils/appError.js";

const errorHandler = (
  error: AppError | Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const statusCode = (error instanceof AppError ? error.statusCode : 500) || 500;
  const message = error.message || "Internal Server Error";

  if (NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      message,
      stack: error.stack
    });
  }

  // Production
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode
  });
};

export default errorHandler;
