import type { Request, Response, NextFunction } from "express";
import { registrationSchema } from "../../zodSchemaType/registration.schema";
import RegistrationDataModel from "../../models/registrartion";
import AppError from "../../utils/appError";
import { ZodError } from "zod";
import generatePatientId from "../../utils/generatePatientId";
import { MongoServerError } from "mongodb";

const registerNewPatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const registrationData = registrationSchema.parse(req.body);

    let { name } = registrationData;

    registrationData.patientId = await generatePatientId();

    const patientExists = await RegistrationDataModel.findOne({
      patientId: registrationData.patientId,
    }).select("name -_id");

    if (patientExists) {
      return res.status(409).json({
        success: false,
        message: `Patient with patient ID of: ${registrationData.patientId} already exists with a name ${name}`,
      });
    }

    await RegistrationDataModel.create(registrationData);

    return res.status(201).json({
      success: true,
      message: `${name} registered successfully`,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    } else if (error instanceof MongoServerError && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A patient with this ID already exists.",
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

export default registerNewPatient;
