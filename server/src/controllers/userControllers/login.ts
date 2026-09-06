import accessTokenGenerator from "../../utils/accessTokenGenerator.js";
import refreshTokenGenerator from "../../utils/refreshTokenGenerator.js";
import cleanUserReq4login from "../../utils/cleanUserReq4login.js";
import AppError from "../../utils/appError.js";
import SurgeonData from "../../models/surgeonData.js";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";



const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  const { cleanedEmail, cleanedPassword } = await cleanUserReq4login(
    email,
    password,
  );
  try {
    const surgeon = await SurgeonData.findOne({ email: cleanedEmail });

    if (!surgeon) {
      return next(new AppError("Invalid user credentials", 401));
    }
    const isMatching = await bcrypt.compare(cleanedPassword, surgeon.password);

    if (!isMatching) {
      return next(new AppError("Invalid user credentials", 401));
    }
    const payload = {
      sub: surgeon._id.toString(),
      name: surgeon.name,
      email: surgeon.email,
      role: surgeon.role,
    };


    const accessToken = accessTokenGenerator(payload);
    const refreshToken = refreshTokenGenerator(payload);
    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: `${surgeon.name} logged in successfully.`,
        data: {
          accessToken,
          user: {
            name: surgeon.name,
            role: surgeon.role,
            email: surgeon.email,
          },
        },
      });
  } catch (error) {
    console.log(error);
    return next(
      error instanceof AppError
        ? error
        : new AppError("Internal Server Error", 500),
    );
  }
};
export default loginController;
