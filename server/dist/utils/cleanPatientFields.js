import AppError from "./appError.js";
const cleanPatientFields = (fields) => {
    const { name, dateOfBirth, sex, address, email, phoneNumbers, diagnosis, status, plannedProcedure, dateOfSurgery, dateOfVisit, medicines, medicalAndSurgicalHistory, } = fields;
    // Validate mandatory fields. You can refine optional fields later.
    if (!name?.trim() ||
        !dateOfBirth ||
        !sex?.trim() ||
        !address?.trim() ||
        !email?.trim() ||
        !phoneNumbers ||
        !Array.isArray(diagnosis) ||
        diagnosis.length === 0 ||
        !status?.trim() ||
        !plannedProcedure?.trim() ||
        !dateOfSurgery ||
        !Array.isArray(medicines) ||
        medicines.length === 0 ||
        !medicalAndSurgicalHistory ||
        !dateOfVisit ||
        !Array.isArray(medicalAndSurgicalHistory.conditions) ||
        medicalAndSurgicalHistory.conditions.length === 0) {
        throw new AppError("All required fields must be provided", 400);
    }
    if (!medicalAndSurgicalHistory) {
        throw new AppError("Medical and surgical field should be provided", 400);
    }
    if (!medicalAndSurgicalHistory.category) {
        throw new AppError("Category should be either 'medical' or 'Surgical'", 400);
    }
    if (typeof medicalAndSurgicalHistory.year !== "number") {
        throw new AppError("Please year must be a number", 400);
    }
    if (!medicalAndSurgicalHistory.notes?.trim()) {
        throw new AppError("Notes must be provide", 400);
    }
    return {
        cleanedName: name.trim(),
        cleanedDateOfBirth: dateOfBirth,
        cleanedSex: sex.trim(),
        cleanedAddress: address.trim(),
        cleanedEmail: email.trim().toLowerCase(),
        cleanedPhoneNumbers: phoneNumbers,
        cleanedDiagnosis: diagnosis,
        cleanedStatus: status.trim(),
        cleanedPlannedProcedure: plannedProcedure.trim(),
        cleanedDateOfSurgery: dateOfSurgery,
        cleanedMedicines: medicines,
        cleanedDateOfVisit: dateOfVisit,
        cleanedMedicalAndSurgicalHistory: medicalAndSurgicalHistory,
    };
};
export default cleanPatientFields;
//# sourceMappingURL=cleanPatientFields.js.map