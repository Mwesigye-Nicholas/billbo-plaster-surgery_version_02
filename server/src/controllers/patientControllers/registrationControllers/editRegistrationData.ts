import AppError from '../../../utils/appError';
import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import RegistrationDataModel from '../../../models/registrartion';
import { updateRegistrationSchema } from '../../../zodSchemaType/updateRegistrationSchema';

const updatePatientRegistrationData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide patient ID',
    });
  }

  try {
    const patientData = updateRegistrationSchema.parse(req.body);

    if (Object.keys(patientData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be provided for update",
      });
    }

    const updatedPatientData = await RegistrationDataModel.findOneAndUpdate(
      { patientId },
      patientData,
      { select: 'name', new: true },
    );

    if (!updatedPatientData) {
      return res.status(404).json({
        success: false,
        message: 'Patient with the provided patient ID does not exist',
      });
    }

    return res.status(200).json({
      success: true,
      message: `${updatedPatientData.name}'s data has been updated successfully`,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        errors: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    } else {
      return next(
        error instanceof AppError
          ? error
          : new AppError('Internal Server Error', 500),
      );
    }
  }
};
export default updatePatientRegistrationData;
