import AppError from "../../utils/appError";
import RegistrationDataModel from "../../models/registrartion";
import type { Request, Response, NextFunction } from "express";

const getRegisteredPatients = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const patientRegData = await RegistrationDataModel.find();

    if (patientRegData.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No patients are currently registered.",
        data: patientRegData,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Registered patients retrieved successfully",
      total: patientRegData.length,
      data: patientRegData,
    });
  } catch (error: unknown) {
    return next(
      error instanceof AppError
        ? error
        : new AppError("Internal Server Error", 500),
    );
  }
};

export default getRegisteredPatients;
