import AppError from "../../utils/appError";
import RegistrationDataModel from "../../models/registrartion";
import type { Request, Response, NextFunction } from "express";

const getRegisteredPatients = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const pageValue = req.query.page;
    const limitValue = req.query.limit;

    const page =
      typeof pageValue === "string" && parseInt(pageValue, 10) > 0
        ? parseInt(pageValue, 10)
        : 1;

    const limit =
      typeof limitValue === "string" && parseInt(limitValue, 10) > 0
        ? parseInt(limitValue, 10)
        : 20;

    const count = await RegistrationDataModel.countDocuments();
    const totalNumberOfPages = Math.ceil(count / limit);

    if (count === 0) {
      return res.status(200).json({
        success: true,
        message: "No patients are currently registered.",
        currentPage: page,
        totalNumberOfPatients: count,
        totalNumberOfPages: 0,
      });
    }

    if (page > totalNumberOfPages) {
      return res.status(400).json({
        success: false,
        message: "Requested Page is beyond the available pages.",
        totalNumberOfPatients: count,
        currentPage: page,
        totalNumberOfPages,
      });
    }

    const patientRegData = await RegistrationDataModel.find()
      .select("patientId name age dateOfBirth sex")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Registered patients retrieved successfully",
      data: patientRegData,
      totalNumberOfPatients: count,
      currentPage: page,
      totalNumberOfPages,
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
