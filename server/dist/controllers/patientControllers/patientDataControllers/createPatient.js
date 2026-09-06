import AppError from "../../../utils/appError.js";
import patientBioData from "../../../models/patientBioData.js";
import patientMedicalData from "../../../models/patientMedicalData.js";
import cleanPatientFields from "../../../utils/cleanPatientFields.js";
import isValidFutureOrTodayDate from "../../../utils/validateDate.js";
import calculateAge from "../../../utils/calculateAge.js";
import mongoose from "mongoose";
import generatePatientId from "../../../utils/generatePatientId.js";
import generateRequestId from "../../../utils/generateRequestId.js";
const createPatientController = async (req, res, next) => {
    req.body.dateOfSurgery = isValidFutureOrTodayDate(req.body.dateOfSurgery);
    let { name, dateOfBirth, sex, address, email, phoneNumbers, diagnosis, status, plannedProcedure, dateOfSurgery, dateOfVisit, medicines, medicalAndSurgicalHistory, } = req.body;
    const cleaned = cleanPatientFields({
        name,
        dateOfBirth,
        sex,
        address,
        email,
        phoneNumbers,
        diagnosis,
        status,
        plannedProcedure,
        dateOfSurgery,
        dateOfVisit,
        medicines,
        medicalAndSurgicalHistory,
    });
    const { cleanedName, cleanedDateOfBirth, cleanedSex, cleanedAddress, cleanedEmail, cleanedPhoneNumbers, cleanedDiagnosis, cleanedStatus, cleanedPlannedProcedure, cleanedDateOfSurgery, cleanedDateOfVisit, cleanedMedicines, cleanedMedicalAndSurgicalHistory, } = cleaned;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const patientId = await generatePatientId(session);
        const patientExists = await patientBioData.findOne({
            $or: [
                {
                    "phoneNumbers.number": {
                        $in: cleanedPhoneNumbers.map((p) => p.number),
                    },
                },
                { email: cleanedEmail },
            ],
        }, null, {
            session,
        });
        if (patientExists) {
            return next(new AppError("Patient already exists", 401));
        }
        const bioDataRecord = await patientBioData.create([
            {
                name: cleanedName,
                patientId,
                dateOfBirth: cleanedDateOfBirth,
                sex: cleanedSex,
                address: cleanedAddress,
                email: cleanedEmail,
                phoneNumbers: cleanedPhoneNumbers,
                createdBy: req.user.sub,
                updatedBy: req.user.sub,
                //medicalData: [medicalRecord[0]._id],
            },
        ], { session });
        if (!bioDataRecord[0]) {
            await session.abortTransaction();
            session.endSession();
            return next(new AppError("Failed to create patient bio data  record", 500));
        }
        const patientBioDataId = bioDataRecord[0]._id;
        const requestId = await generateRequestId(session);
        const medicalRecord = await patientMedicalData.create([
            {
                diagnosis: cleanedDiagnosis,
                status: cleanedStatus,
                plannedProcedure: cleanedPlannedProcedure,
                dateOfVisit: cleanedDateOfVisit,
                dateOfSurgery: cleanedDateOfSurgery,
                requestId,
                medicines: cleanedMedicines,
                medicalAndSurgicalHistory: cleanedMedicalAndSurgicalHistory,
                surgeon: req.user.sub,
                patient: patientBioDataId,
                createdBy: req.user.sub,
                updatedBy: req.user.sub,
            },
        ], { session });
        if (!medicalRecord[0]) {
            await session.abortTransaction();
            session.endSession();
            return next(new AppError("Failed to create patient medical record", 500));
        }
        bioDataRecord[0].medicalData.push(medicalRecord[0]._id);
        await bioDataRecord[0].save({ session });
        await session.commitTransaction();
        session.endSession();
        console.log("Patient's age: ", calculateAge(dateOfBirth));
        return res.status(201).json({
            success: true,
            message: `${bioDataRecord[0].name} has been booked successfully`,
            data: {
                patientId,
                id: bioDataRecord[0]._id,
                age: calculateAge(dateOfBirth),
            },
        });
    }
    catch (error) {
        console.log(error);
        await session.abortTransaction();
        session.endSession();
        return next(error instanceof AppError
            ? error
            : new AppError("Internal Server Error", 500));
    }
};
export default createPatientController;
//# sourceMappingURL=createPatient.js.map