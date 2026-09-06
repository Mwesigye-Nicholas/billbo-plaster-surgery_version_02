import type { Request, Response, NextFunction } from "express";
import AppError from "../../utils/appError.js";
import monitorRedis from "../../utils/monitorRedis.js";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET_KEY } from "../../config/env.js";
import type { RefreshTokenPayload } from "../../types/express/tokenPayload.js";

const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully",
      });
  }

  try {
    // INDUSTRY STANDARD: only blacklist refresh token
    const decoded = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET_KEY,
    ) as RefreshTokenPayload;

    await monitorRedis(decoded.jti);

    return res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({
        message: "Logged out successfully",
        success: true,
      });
  } catch (error) {
    console.log("Logout Error: ", error);

    return next(
      error instanceof AppError
        ? error
        : new AppError("Internal Server Error", 500),
    );
  }
};

export default logoutController;
