import multer from "multer";
import AppError from "../utils/appError.js";
const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/dicom",
];
export const uploadPatientImages = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 6, // HARD LIMIT at Multer level
    },
    fileFilter(req, file, cb) {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            cb(new AppError("Unsupported file type", 400));
        }
        else {
            cb(null, true);
        }
    },
});
//# sourceMappingURL=uploadPatientImages.js.map