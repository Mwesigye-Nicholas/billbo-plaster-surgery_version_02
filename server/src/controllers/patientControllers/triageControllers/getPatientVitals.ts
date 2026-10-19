import AppError from "../../../utils/appError";
import TriageDataModel from "../../../models/triageData";
import type { Request, Response, NextFunction } from "express";
import RegistrationDataModel from "../../../models/registrartion";

const getPatientTriageHistory = async (req: Request, res: Response, next: NextFunction) => {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({
      success: false,
      message: "Please provide the patient Id",
    });
  }

  try {
    const patient = await RegistrationDataModel.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient was not registered, please register the patient first",
      });
    }

    const patientRegId = patient._id;

    const triagePatientData = await TriageDataModel.find({patientRegId}).sort({date: -1, _id: -1});

    if (triagePatientData.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No triage records found for this patient",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Patient triage data retrieved successfully",
      data: triagePatientData,
    });
  } catch (error: unknown) {
    return next(error instanceof AppError ? error : new AppError("Internal Server Error", 500));
  }
};

export default getPatientTriageHistory;
