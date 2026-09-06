import AppError from "../../../utils/appError.js";
import patientBioData from "../../../models/patientBioData.js";
import patientMedicalData from "../../../models/patientMedicalData.js";
import isValidFutureOrTodayDate from "../../../utils/validateDate.js";
import calculateAge, {} from "../../../utils/calculateAge.js";
import cleanPatientFieldsForUpdate from "../../../utils/cleanPatientFieldsForUpdate.js";
import mongoose from "mongoose";
const updatePatientDataController = async (req, res, next) => {
    const patientId = typeof req.params.patientId === "string" ? req.params.patientId.trim() : "";
    if (!patientId) {
        return next(new AppError("Patient ID is required", 403));
    }
    const session = await mongoose.startSession();
    try {
        const validateDateOfSurgery = req.body.dateOfSurgery !== undefined
            ? isValidFutureOrTodayDate(req.body.dateOfSurgery)
            : undefined;
        const input = {};
        // Bio fields
        if (req.body.name !== undefined) {
            input.name = req.body.name;
        }
        if (req.body.dateOfBirth !== undefined) {
            input.dateOfBirth = req.body.dateOfBirth;
        }
        if (req.body.sex !== undefined) {
            input.sex = req.body.sex;
        }
        if (req.body.address !== undefined) {
            input.address = req.body.address;
        }
        if (req.body.email !== undefined) {
            input.email = req.body.email;
        }
        if (req.body.phoneNumbers !== undefined) {
            input.phoneNumbers = req.body.phoneNumbers;
        }
        // Medical fields
        if (req.body.diagnosis !== undefined) {
            input.diagnosis = req.body.diagnosis;
        }
        if (req.body.status !== undefined) {
            input.status = req.body.status;
        }
        if (req.body.plannedProcedure !== undefined) {
            input.plannedProcedure = req.body.plannedProcedure;
        }
        // Important: dateOfSurgery already validated
        if (validateDateOfSurgery !== undefined) {
            input.dateOfSurgery = validateDateOfSurgery;
        }
        if (req.body.requestId !== undefined) {
            input.requestId = req.body.requestId;
        }
        if (req.body.medicines !== undefined) {
            input.medicines = req.body.medicines;
        }
        if (req.body.medicalAndSurgicalHistory !== undefined) {
            input.medicalAndSurgicalHistory = req.body.medicalAndSurgicalHistory;
        }
        const fields = cleanPatientFieldsForUpdate(input);
        let updatedAge;
        if (fields.cleanedDateOfBirth !== undefined) {
            updatedAge = calculateAge(fields.cleanedDateOfBirth);
        }
        session.startTransaction();
        //* find patient.
        const patient = await patientBioData
            .findOne({ patientId }).session(session);
        if (!patient) {
            await session.abortTransaction();
            return next(new AppError("Patient not found", 404));
        }
        const patientBioDataId = patient._id;
        if (!patientBioDataId) {
            return next(new AppError("Failed to retrieve patient Bio Data Id", 500));
        }
        const medicalDataId = patient.medicalData[0];
        const updatedMedicalDataPayLoad = {};
        if (fields.cleanedDiagnosis !== undefined)
            updatedMedicalDataPayLoad.diagnosis = fields.cleanedDiagnosis;
        if (fields.cleanedStatus !== undefined)
            updatedMedicalDataPayLoad.status = fields.cleanedStatus;
        if (fields.cleanedPlannedProcedure !== undefined)
            updatedMedicalDataPayLoad.plannedProcedure =
                fields.cleanedPlannedProcedure;
        if (fields.cleanedDateOfSurgery !== undefined)
            updatedMedicalDataPayLoad.dateOfSurgery = fields.cleanedDateOfSurgery;
        if (fields.cleanedRequestId !== undefined)
            updatedMedicalDataPayLoad.requestId = fields.cleanedRequestId;
        updatedMedicalDataPayLoad.updatedBy = req.user?.sub;
        if (fields.cleanedMedicalAndSurgicalHistory !== undefined)
            updatedMedicalDataPayLoad.medicalAndSurgicalHistory =
                fields.cleanedMedicalAndSurgicalHistory;
        if (fields.cleanedMedicines !== undefined)
            updatedMedicalDataPayLoad.medicines = fields.cleanedMedicines;
        const updatedPatientBioDataPayLoad = {};
        if (fields.cleanedName !== undefined)
            updatedPatientBioDataPayLoad.name = fields.cleanedName;
        if (fields.cleanedDateOfBirth !== undefined)
            updatedPatientBioDataPayLoad.dateOfBirth = fields.cleanedDateOfBirth;
        if (fields.cleanedSex !== undefined)
            updatedPatientBioDataPayLoad.sex = fields.cleanedSex;
        if (fields.cleanedAddress !== undefined)
            updatedPatientBioDataPayLoad.address = fields.cleanedAddress;
        if (fields.cleanedEmail !== undefined)
            updatedPatientBioDataPayLoad.email = fields.cleanedEmail;
        if (fields.cleanedPhoneNumbers !== undefined)
            updatedPatientBioDataPayLoad.phoneNumbers = fields.cleanedPhoneNumbers;
        //* update medical data.
        const updatedMedical = await patientMedicalData.findByIdAndUpdate(medicalDataId, updatedMedicalDataPayLoad, { new: true, session });
        if (!updatedMedical) {
            await session.abortTransaction();
            return next(new AppError("Failed to update, patient's medical data", 500));
        }
        //* update bio data.
        const updatedBio = await patientBioData.findByIdAndUpdate(patientBioDataId, updatedPatientBioDataPayLoad, { new: true, session, lean: true });
        if (!updatedBio) {
            await session.abortTransaction();
            return next(new AppError("Failed to update patient's bio data", 500));
        }
        await session.commitTransaction();
        return res.status(200).json({
            success: true,
            message: `${updatedBio.name} has been updated successfully`,
            data: {
                age: updatedAge,
            },
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
export default updatePatientDataController;
//# sourceMappingURL=updatePatientData.js.map