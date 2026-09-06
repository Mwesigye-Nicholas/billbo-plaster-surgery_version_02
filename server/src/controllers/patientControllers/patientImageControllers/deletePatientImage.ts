import type { Request, Response, NextFunction } from "express";
import AppError from "../../../utils/appError.js";
import mongoose from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";
import imageMetaData from "../../../models/imageMetaData.js";
import patientBioData from "../../../models/patientBioData.js";


const deletePatientImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { imageId } = req.params;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //1. find image metadata
    const image = await imageMetaData.findOne({
      _id: imageId,
      isDeleted: false,
    });

    if (!image) {
      session.abortTransaction();
      return next(new AppError("Images not found", 404));
    }

    //2. Decrement patient image counter.

    const patient = await patientBioData.findOneAndUpdate(
      {
        _id: image.patient,
        imageCount: { $gt: 0 },
      },
      { $inc: { imageCount: -1 } },
      { session }
    );

    if (!patient) {
      session.abortTransaction();
      return next(new AppError("Patient not found", 404));
    }

    //3. Soft delete metadata.
    (image.isDeleted = true), await image.save({ session });

    //4. Delete GridFs File
    const db = mongoose.connection.db;
    if (!db) {
      return next(new AppError("Database connection not initialized", 500));
    }

    const bucket = new GridFSBucket(db, { bucketName: "patientImages" });

    await bucket.delete(new ObjectId(image.fileId.toString()));

    //5. Commit abortTransaction
    await session.commitTransaction();
    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    return next(
      error instanceof AppError
        ? error
        : new AppError("Failed to delete image", 500)
    );
  } finally {
    session.endSession();
  }

  //
};
export default deletePatientImage;