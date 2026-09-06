import type { Request, Response, NextFunction } from "express";
import AppError from "../../../utils/appError.js";
import imageMetaData from "../../../models/imageMetaData.js";
import { Types } from "mongoose";
import patientBioData from "../../../models/patientBioData.js";

const getImagesByPatientId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { patientId } = req.params;
  if (!patientId) {
    return next(new AppError("Patient Id is Required", 400));
  }

  const patientBioDataId = await patientBioData.findOne({ patientId });
  
  if (!patientBioDataId) {
    return next(new AppError(`Failed to fetch patient Bio data with ID of ${patientId}`, 404));
  }

  const images = await imageMetaData
    .find({
      patient: patientBioDataId?._id,
      isDeleted: false,
    })
    .populate({ path: "patient", select: "name" })
    .select("-__v")
    .sort({ createdAt: -1 });

  if (images.length === 0) {
    return res.status(200).json({
      success: true,
      totalImages: images.length,
      data: images,
    });
  }

  return res.status(200).json({
    success: true,
    totalImages: images.length,
    data: images,
  });
};

export default getImagesByPatientId;
