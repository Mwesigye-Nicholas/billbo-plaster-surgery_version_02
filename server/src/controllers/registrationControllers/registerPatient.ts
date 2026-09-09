import type { Request, Response, NextFunction } from "express";
import { registrationSchema } from "../../zodSchemaType/registration.schema";
import AppError from "../../utils/appError";
import {z, ZodError } from "zod";


const registerNewPatient = async (req:Request, res: Response, next: NextFunction): Promise<void> => {

 try {
   const registrationData = registrationSchema.parse(req.body);
 } catch (error) {

  if (error instanceof ZodError){

  }

  
 }
  
};

export default registerNewPatient;
