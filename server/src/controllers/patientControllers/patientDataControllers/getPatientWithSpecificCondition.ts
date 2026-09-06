import type { Request, Response, NextFunction } from "express";
import patientMedicalData from "../../../models/patientMedicalData.js";
import AppError from "../../../utils/appError.js";

const getPatientsWithSpecificConditionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const condition =
    typeof req.params.condition === "string" ? req.params.condition.trim() : "";

  if (!condition) {
    return next(new AppError("Condition is required", 400));
  }
  try {
    const medicalRecords = await patientMedicalData
      .find({ diagnosis: condition })
      .populate({ path: "patient", select: "-__v -createdBy -updatedAt" })
      .lean();
    return res.status(200).json({
      success: true,
      message:
        medicalRecords.length === 0
          ? `No patients found with condition: ${condition}`
          : "Patients fetched successfully",
      data: {
        patientData: medicalRecords,
        total: medicalRecords.length,
      },
    });
  } catch (error) {
    return next(
      error instanceof AppError
        ? error
        : new AppError("Internal server error", 500)
    );
  }
};
export default getPatientsWithSpecificConditionController;
