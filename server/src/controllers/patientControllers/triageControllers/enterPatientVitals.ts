import type { Request, Response, NextFunction } from "express";
import AppError from "../../../utils/appError";
import { triageSchema } from "../../../zodSchemaType/triage.schema";
import { ZodError } from "zod";
import TriageDataModel from "../../../models/triageData";
import RegistrationDataModel from "../../../models/registrartion";
const enterPatientVitals = async (req: Request, res: Response, next: NextFunction) => {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({
      success: false,
      message: "Please provide the patient ID",
    });
  }

  try {
    const triagePatientData = triageSchema.parse(req.body);
    const patient = await RegistrationDataModel.findOne({ patientId }).select("name");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient is not registered please register the patient first.",
      });
    }

    await TriageDataModel.create(triagePatientData);

    return res.status(201).json({
      success: true,
      message: "Patient triage data added successfully",
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    } else {
      return next(error instanceof AppError ? error : new AppError("Internal Server Error", 500));
    }
  }
};

export default enterPatientVitals;
