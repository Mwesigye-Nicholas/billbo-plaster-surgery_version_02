import type { Request, Response, NextFunction } from "express";
import RegistrationDataModel from "../../../models/registrartion";
import TriageData from "../../../models/triageData";
import AppError from "../../../utils/appError";
import { triageSchema} from "../../../zodSchemaType/triage.schema";
import {  ZodError } from "zod";
import { MongoServerError } from "mongodb";

const enterPatientVitals = async (req: Request, res: Response, next: NextFunction) => {
  const { patientId } = req.params;

  const triagePatientData = triageSchema.parse(req.body);

  if (!patientId) {
    return res.status(400).json({
      success: false,
      message: "Please provide the patient ID",
    });
  }

  try {
    const isPatientRegistered = await RegistrationDataModel.findOne({ patientId }).select("name");

    if (!isPatientRegistered) {
      return res.status(404).json({
        success: false,
        message: "Patient is not registered please register the patient first.",
      });
    }

    await TriageData.create(triagePatientData);

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
    } else if (error instanceof MongoServerError && error.code === 1100) {
      return res.status(409).json({
        success: false,
        message: "A patient with this ID already exists.",
      });
    } else{
        return next(error instanceof AppError ? error : new AppError("Internal Server Error", 500));
    }
  }
};

export default enterPatientVitals;
