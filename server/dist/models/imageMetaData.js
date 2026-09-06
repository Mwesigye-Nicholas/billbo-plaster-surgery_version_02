import { Schema, model, Types } from "mongoose";
const imageMetaDataSchema = new Schema({
    patient: {
        type: Types.ObjectId,
        ref: "patientBioData",
        required: true,
    },
    fileId: {
        type: Types.ObjectId,
        required: true,
        unique: true, // one metadata record per GridFS file
    },
    imageType: {
        type: String,
        enum: ["X-ray", "CT-Scan", "MRI", "Other"],
        required: true,
        index: true,
    },
    originalFileName: {
        type: String,
        trim: true,
    },
    sizeInBytes: {
        type: Number,
        required: true,
        min: 1,
    },
    uploadedBy: {
        type: String,
        required: true,
        trim: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
/**
 * Enforce max 6 images per patient (soft enforcement support)
 */
imageMetaDataSchema.index({ patient: 1, isDeleted: 1 }, { name: "patient_image_limit" });
const imageMetaData = model("imageMetaData", imageMetaDataSchema);
export default imageMetaData;
//# sourceMappingURL=imageMetaData.js.map