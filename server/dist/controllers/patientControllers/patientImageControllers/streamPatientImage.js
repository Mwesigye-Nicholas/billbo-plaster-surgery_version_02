import mongoose from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";
import imageMetaData from "../../../models/imageMetaData.js";
import AppError from "../../../utils/appError.js";
import imageTypeToMime from "../../../utils/imageMimeMap.js";
/**
 * STREAM IMAGE
 */
const streamPatientImage = async (req, res, next) => {
    const { imageId } = req.params;
    if (!imageId) {
        return next(new AppError("Image Id ie required", 400));
    }
    if (!mongoose.Types.ObjectId.isValid(imageId)) {
        return next(new AppError("Invalid image id", 400));
    }
    const image = await imageMetaData.findOne({
        _id: imageId,
        isDeleted: false,
    });
    if (!image) {
        return next(new AppError("Image not found", 404));
    }
    const db = mongoose.connection.db;
    if (!db) {
        return next(new AppError("Database not initialized", 500));
    }
    const bucket = new GridFSBucket(db, {
        bucketName: "patientImages",
    });
    // fetch GridFS file document.
    res.setHeader("Content-Type", imageTypeToMime[image.imageType] ?? "application/octet-stream");
    res.setHeader("Content-Disposition", `inline; filename="${image.originalFileName ?? "image"}"`);
    const downloadStream = bucket.openDownloadStream(new ObjectId(image.fileId.toString()));
    downloadStream.on("error", () => {
        next(new AppError("Error streaming image", 500));
    });
    downloadStream.pipe(res);
};
export default streamPatientImage;
//# sourceMappingURL=streamPatientImage.js.map