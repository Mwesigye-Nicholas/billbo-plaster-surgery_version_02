import type { Request, Response, NextFunction } from "express";
import patientBioData from "../../../models/patientBioData.js";
import AppError from "../../../utils/appError.js";

const getAllPatientsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 10);
    const skip = (page - 1) * limit;

    const [patients, totalNumberOfPatients] = await Promise.all([
      patientBioData
        .find()
        .sort({ createdAt: -1 })
        .populate("medicalData")
        .skip(skip)
        .limit(limit)
        .lean(),
      patientBioData.countDocuments(),
    ]);

    const totalPages: number = Math.ceil(totalNumberOfPatients / limit);

    return res.status(200).json({
      success: true,
      message: "All patients data fetched successfully",
      data: {
        patients,
        page,
        limit,
        totalPages,
        totalNumberOfPatients,
      },
    });
  } catch (error) {
    console.log(error);
    
    return next(
      error instanceof AppError
        ? error
        : new AppError("Internal Server Error", 500)
    );
  }
};
export default getAllPatientsController;
