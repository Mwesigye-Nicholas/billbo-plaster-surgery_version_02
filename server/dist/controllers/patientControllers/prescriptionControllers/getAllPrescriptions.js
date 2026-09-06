import AppError from "../../../utils/appError.js";
import patientBioData from "../../../models/patientBioData.js";
import prescriptionData from "../../../models/prescription.js";
const getAllPrescriptions = async (req, res, next) => {
    const { patientId } = req.params;
    if (!patientId) {
        return next(new AppError("Please provide the patient Id", 403));
    }
    try {
        const bioData = await patientBioData.findOne({ patientId });
        if (!bioData) {
            return next(new AppError("Patient bio data not available", 404));
        }
        const patientBiodataId = bioData._id;
        const prescriptions = await prescriptionData
            .find({ patientBioData: patientBiodataId })
            .populate({ path: "doctorId", select: "name" })
            .sort({ createdAt: -1 });
        if (prescriptions.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    currentPrescription: null,
                    history: [],
                },
            });
        }
        const currentPrescription = prescriptions[0];
        const history = prescriptions.slice(1);
        return res.status(200).json({
            success: true,
            data: {
                currentPrescription,
                history,
                total: prescriptions.length,
            },
        });
    }
    catch (error) {
        return next(error instanceof AppError
            ? error
            : new AppError("Internal server error", 500));
    }
};
export default getAllPrescriptions;
//# sourceMappingURL=getAllPrescriptions.js.map