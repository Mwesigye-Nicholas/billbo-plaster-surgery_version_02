import imageMetaData from "../../../models/imageMetaData.js";
import AppError from "../../../utils/appError.js";
import patientBioData from "../../../models/patientBioData.js";
import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";
const MAX_IMAGES_PER_PATIENT = 6;
const addPatientImages = async (req, res, next) => {
    const { patientId } = req.params;
    if (!patientId) {
        return next(new AppError("Patient Id is required", 401));
    }
    const files = req.files;
    if (!files || files.length === 0) {
        return next(new AppError("No images uploaded", 400));
    }
    let db;
    const uploadedFileIds = [];
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const imagesToAdd = files.length;
        const filter = {
            patientId: patientId,
            imageCount: { $lte: MAX_IMAGES_PER_PATIENT - imagesToAdd },
        };
        const patient = await patientBioData.findOneAndUpdate(filter, {
            $inc: { imageCount: imagesToAdd },
        }, {
            session,
            new: true,
        });
        console.log("Patient Id from bioData", patient);
        //const patient = await patientBioData.findById(patientId).session(session);
        if (!patient) {
            await session.abortTransaction();
            return next(new AppError("Patient doesn't exit or image limit exceeded", 409));
        }
        db = await mongoose.connection.db;
        if (!db) {
            return next(new AppError("Database connection not initialized", 500));
        }
        const bucket = new GridFSBucket(db, { bucketName: "patientImages" });
        const createdMetaDocs = [];
        for (const file of files) {
            const uploadStream = bucket.openUploadStream(file.originalname, {
                metadata: {
                    contentType: file.mimetype,
                }
            });
            uploadStream.end(file.buffer);
            await new Promise((resolve, reject) => {
                uploadStream.on("finish", resolve);
                uploadStream.on("error", reject);
            });
            uploadedFileIds.push(uploadStream.id);
            if (!req.body.imageType) {
                return next(new AppError("Image Type required", 400));
            }
            const meta = await imageMetaData.create([
                {
                    patient: patient._id,
                    fileId: uploadStream.id,
                    imageType: req.body.imageType, // validated at route or middleware
                    originalFileName: file.originalname,
                    sizeInBytes: file.size,
                    uploadedBy: req.body.user?.name ?? "system",
                },
            ], { session });
            createdMetaDocs.push(meta[0]);
        }
        await session.commitTransaction();
        return res.status(201).json({
            success: true,
            message: "Images uploaded successfully",
            data: {
                message: "Patient image uploaded successfully",
                uploadedCount: createdMetaDocs.length,
                images: createdMetaDocs,
            },
        });
    }
    catch (error) {
        if (db && uploadedFileIds.length > 0) {
            const bucket = new GridFSBucket(db, { bucketName: "patientImages" });
            for (const id of uploadedFileIds) {
                await bucket.delete(id).catch(() => { });
            }
        }
        await session.abortTransaction();
        return next(error instanceof AppError
            ? error
            : new AppError("Internal Server Error", 500));
    }
    finally {
        session.endSession();
    }
};
export default addPatientImages;
//# sourceMappingURL=addPatientImage.js.map