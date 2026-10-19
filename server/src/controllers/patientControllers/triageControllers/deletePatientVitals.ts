import AppError from "../../../utils/appError";
import TriageDataModel from "../../../models/triageData";
import RegistrationDataModel from "../../../models/registrartion";
import type { Request, Response, NextFunction } from "express";

const deleteAllPatientRegHistroy = async (req: Request, res: Response, next: NextFunction) => {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({
      success: false,
      message: "Please provide patientID",
    });
  }

  try {
    const patient = await RegistrationDataModel.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not registered",
      });
    }

    const patientRegId = patient._id;

    const deleteInformation = await TriageDataModel.deleteMany({ patientRegId });

    if (deleteInformation.deletedCount > 0) {
      return res.status(200).json({
        success: true,
        message: "Patient triage history deleted",
        deletedDocumentCount: deleteInformation.deletedCount,
      });
    }
    return res.status(200).json({
        success: true,
        message: "No Patient triage history found for this patient",
        deletedDocumentCount: deleteInformation.deletedCount,
      });

  } catch (error: unknown) {
    return next(error instanceof AppError ? error : new AppError("Internal Server Error", 500));
  }
};
export default deleteAllPatientRegHistroy;
