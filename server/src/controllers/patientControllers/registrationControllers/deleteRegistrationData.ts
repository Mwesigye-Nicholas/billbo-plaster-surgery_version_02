import type { Request, Response, NextFunction } from "express";
import AppError from "../../../utils/appError";
import RegistrationDataModel from "../../../models/registrartion";

const deletePatientRegData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({
      success: false,
      message: "Please provide patient ID",
    });
  }

  try {
    const patientData = await RegistrationDataModel.findOneAndDelete({
      patientId,
    });

    if (!patientData) {
      return res.status(404).json({
        success: false,
        message: "Patient with the provided ID does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient Deleted successfully",
    });
  } catch (error: unknown) {
    return next(
      error instanceof AppError
        ? error
        : new AppError("Internal Server Error", 500)
    );
  }
};
export default deletePatientRegData;
