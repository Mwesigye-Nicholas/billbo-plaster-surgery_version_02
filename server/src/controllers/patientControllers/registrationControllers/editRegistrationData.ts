import AppError from "../../../utils/appError";
import type { Request, Response, NextFunction } from "express";
import { success, ZodError } from "zod";
import RegistrationDataModel from "../../../models/registrartion";
import { registrationSchema } from "../../../zodSchemaType/registration.schema";

const updatePatientRegistrationData = async (
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
    const patientData = registrationSchema.parse(req.body);

    const updatedPatientData = await RegistrationDataModel.findOneAndUpdate(
      { patientId },
      patientData,
      { select: "name", createdAt: -1 },
    );

    if (!updatedPatientData) {
      return res.status(404).json({
        success: false,
        message: "Patient with the provided patient ID does not exist",
      });
    }

    return res.status(201).json({
      success: true,
      message: `${updatedPatientData.name}'s data has beene updated successfully`,
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
      return next(
        error instanceof AppError
          ? error
          : new AppError("Internal Server Error", 500),
      );
    }
  }
};
export default updatePatientRegistrationData;
