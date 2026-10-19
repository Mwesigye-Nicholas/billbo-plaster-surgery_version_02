import AppError from "../../../utils/appError";
import TriageDataModel from "../../../models/triageData";
import RegistrationDataModel from "../../../models/registrartion";
import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { triageSchema } from "../../../zodSchemaType/triage.schema";

const updatePatientTriageData = async (req: Request, res: Response, next: NextFunction) => {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({
      success: false,
      message: "Provide Patient ID",
    });
  }

  try {
    const patientData = triageSchema.parse(req.body);

    if (Object.keys(patientData).length === 0){
      return res.status(400).json({
        success: false,
        message: "At least one field should be updated"
      })
    }

    const patient = await RegistrationDataModel.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient is not registered",
      });
    }

    const patientRegId = patient._id;

    const updatedPatientTriageData = await TriageDataModel.findOneAndUpdate({ patientRegId }, patientData);

    if (!updatedPatientTriageData){
      res.status(404).json({
        success: false,
        message: "Patient not found"
      })
    }
    return res.status(200).json({
      success: true,
      message: "Patient data updated successfully",
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
    return next(error instanceof AppError ? error : new AppError("Internal server error", 500));
  }
};

export default updatePatientTriageData;
