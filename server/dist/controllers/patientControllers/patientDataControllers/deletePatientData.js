import AppError from "../../../utils/appError.js";
import mongoose from "mongoose";
import patientBioData from "../../../models/patientBioData.js";
import patientMedicalData from "../../../models/patientMedicalData.js";
const deletePatientController = async (req, res, next) => {
    const patientId = typeof req.params.patientId === "string" ? req.params.patientId.trim() : "";
    if (!patientId || typeof patientId !== "string" || !patientId.trim()) {
        return next(new AppError("Invalid patientId", 400));
    }
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const patient = await patientBioData.findOne({ patientId }, null, {
            session,
        });
        if (!patient) {
            await session.abortTransaction();
            return next(new AppError("Patient doesn't exist", 404));
        }
        if (patient.medicalData.length > 0) {
            await patientMedicalData.deleteMany({ _id: { $in: patient.medicalData } }, { session });
        }
        await patientBioData.deleteOne({
            _id: patient._id,
        }, { session });
        await session.commitTransaction();
        return res.status(200).json({
            success: true,
            message: `${patient.name} has been deleted successfully.`,
        });
    }
    catch (error) {
        await session.abortTransaction();
        return next(error instanceof AppError
            ? error
            : new AppError("Internal Server Error", 500));
    }
    finally {
        session.endSession();
    }
};
export default deletePatientController;
//# sourceMappingURL=deletePatientData.js.map