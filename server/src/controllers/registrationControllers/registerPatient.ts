import type { Request, Response, NextFunction } from "express";
import { registrationSchema, type Registration } from "../../zodSchemaType/registration.schema";


const registerNewPatient = async (req:Request, res: Response, next: NextFunction): Promise<void> => {
  const [
    name,
    sex,
    address,
    dateOfBirth,
    phoneNumbers,
    email,
    nextOfKin,
    patientId,
  ] = req.body;
};

export default registerNewPatient;
