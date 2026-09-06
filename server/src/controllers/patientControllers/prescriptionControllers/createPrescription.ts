import type { Request, Response, NextFunction } from "express";
import AppError from "../../../utils/appError.js";
import prescriptionData from "../../../models/prescription.js";
import patientBioData from "../../../models/patientBioData.js";

const createPrescription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  const { patientId } = req.params;

  if (!patientId) {
    return next(new AppError("PatientId is required please", 401));
  }

  const { issuedOn, isActive, medicines} = req.body;

  if (!medicines || medicines.length === 0) {
    return next(new AppError("All fields required", 401));
  }

  try {

    const bioData = await patientBioData.findOne({ patientId }).populate({
    path: "medicalData", select: "-__v -createdBy -updatedAt -createdAt"
    });
    
  if (!bioData) {
    return next(new AppError("No patient Bio Data found", 404));
  }

    const patientBioDataId = bioData._id;
    const medicalDataId = bioData.medicalData[0]?._id;
  
  if (!patientBioDataId) {
    return next(new AppError("Failed to fetch patient Data", 403));
    };

    if (!medicalDataId) {
      return next(new AppError("No medical data found", 404))
    };

    await prescriptionData.create({
      isActive,
      medicines,
      patientBioData: patientBioDataId,
      doctorId: req.user!.sub,
      medicalData: medicalDataId,

    });
   
    return res.status(201).json({
      success: true,
      message: "Prescription Completed successfully"
    })
  } catch (error) {
    return next(
      error instanceof AppError
        ? error
        : new AppError("Internal Server Error", 500),
    );
  }
};

export default createPrescription;
