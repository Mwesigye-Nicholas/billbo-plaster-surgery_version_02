import AppError from "../../../utils/appError.js";
import patientBioData from "../../../models/patientBioData.js";
const getPatientWithSpecificPatientNumber = async (req, res, next) => {
    const patientId = typeof req.params.patientId === "string" ? req.params.patientId.trim() : "";
    console.log("PatientId", patientId);
    console.log("request Params", req.params);
    if (!patientId) {
        return next(new AppError("PatientId is required", 400));
    }
    try {
        const patientData = await patientBioData
            .findOne({ patientId })
            .populate({
            path: "medicalData", select: "-__v -createdBy -updatedAt -createdAt", populate: {
                path: "surgeon", select: "name"
            }
        })
            .lean();
        if (!patientData) {
            return next(new AppError(`Patient with ${patientId} doesn't exist`, 404));
        }
        console.log("Surgeon: ", req.user?.name);
        return res.status(200).json({
            success: true,
            message: "Patient data is as follows:",
            data: {
                patientData,
            },
        });
    }
    catch (error) {
        console.log("Error: ", error);
        return next(error instanceof AppError
            ? error
            : new AppError("Internal Server Error", 500));
    }
};
export default getPatientWithSpecificPatientNumber;
//# sourceMappingURL=getPatientWithSpecificPatientNumber.js.map