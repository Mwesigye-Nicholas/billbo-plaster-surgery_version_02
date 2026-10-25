import AppError from "../../../utils/appError";
import TriageDataModel from "../../../models/triageData";
import RegistrationDataModel from "../../../models/registrartion";
import type { Request, Response, NextFunction } from "express";
import { triageSchema } from "../../../zodSchemaType/triage.schema";
import mongoose from "mongoose";
import { ZodError } from "zod";

const updatePatientTriageData = async (req: Request, res: Response, next: NextFunction) => {
 
  const { patientId, triageId } = req.params;

  if (!patientId) {
    return res.status(400).json({
      success: false,
      message: "Provide patient and triage ID",
    });
  }

  if (!triageId) {
    return res.status(400).json({
      success: false,
      message: "Provide  triage ID",
    });
  }

  try {
    if (!mongoose.isValidObjectId(triageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid triage Id",
      });
    }

    const patient = await RegistrationDataModel.findOne({ patientId });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient is not registered",
      });
    }

    const patientData = triageSchema.parse(req.body);

    if (Object.keys(patientData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field should be updated",
      });
    }

    const updatedPatientTriageData = await TriageDataModel.findOneAndUpdate(
      { _id: triageId, patientRegId: patient._id },
      patientData,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!updatedPatientTriageData) {
      return res.status(404).json({
        success: false,
        message: "Triage record not found for this patient.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Patient data updated successfully",
      data: updatedPatientTriageData,
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
