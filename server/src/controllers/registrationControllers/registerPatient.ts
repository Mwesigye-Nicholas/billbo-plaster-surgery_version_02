import type { Request, Response, NextFunction } from "express";
import { registrationSchema } from "../../zodSchemaType/registration.schema";
import AppError from "../../utils/appError";
import { z, ZodError } from "zod";

const registerNewPatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const registrationData = registrationSchema.parse(req.body);

    const {
      name,
      sex,
      address,
      dateOfBirth,
      phoneNumbers,
      email,
      nextOfKin,
      patientId,
    } = registrationData;

    

  } catch (error) {
    if (error instanceof ZodError) {
      return {
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      };
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
