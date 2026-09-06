import AppError from "./appError.js";
const cleanPatientFieldsForUpdate = (fields) => {
    const cleaned = {};
    /** Bio data */
    if (fields.name !== undefined) {
        if (!fields.name.trim()) {
            throw new AppError("Name cannot be empty", 400);
        }
        cleaned.cleanedName = fields.name.trim();
    }
    if (fields.dateOfBirth !== undefined) {
        cleaned.cleanedDateOfBirth = fields.dateOfBirth;
    }
    if (fields.sex !== undefined) {
        if (!fields.sex.trim()) {
            throw new AppError("Sex cannot be empty", 400);
        }
        cleaned.cleanedSex = fields.sex.trim();
    }
    if (fields.address !== undefined) {
        if (!fields.address.trim()) {
            throw new AppError("Address cannot be empty", 400);
        }
        cleaned.cleanedAddress = fields.address.trim();
    }
    if (fields.email !== undefined) {
        if (!fields.email.trim()) {
            throw new AppError("Email cannot be empty", 400);
        }
        cleaned.cleanedEmail = fields.email.trim().toLowerCase();
    }
    if (fields.phoneNumbers !== undefined) {
        cleaned.cleanedPhoneNumbers = fields.phoneNumbers;
    }
    /* *  medical data*/
    if (fields.diagnosis !== undefined) {
        if (!Array.isArray(fields.diagnosis) || fields.diagnosis.length === 0) {
            throw new AppError("Diagnosis cannot be empty", 400);
        }
        cleaned.cleanedDiagnosis = fields.diagnosis.map(d => d.trim());
    }
    if (fields.status !== undefined) {
        if (!fields.status.trim()) {
            throw new AppError("status cannot be empty", 400);
        }
        cleaned.cleanedStatus = fields.status.trim();
    }
    if (fields.plannedProcedure !== undefined) {
        if (!fields.plannedProcedure.trim()) {
            throw new AppError("Planned Procedure cannot be empty", 400);
        }
        cleaned.cleanedPlannedProcedure = fields.plannedProcedure.trim();
    }
    if (fields.dateOfSurgery !== undefined) {
        if (!fields.dateOfSurgery.trim()) {
            throw new AppError("Date of surgery cannot be empty", 400);
        }
        cleaned.cleanedDateOfSurgery = fields.dateOfSurgery.trim();
    }
    if (fields.requestId !== undefined) {
        if (!fields.requestId.trim()) {
            throw new AppError("Request Id cannot be empty", 400);
        }
        cleaned.cleanedRequestId = fields.requestId.trim();
    }
    if (fields.medicines !== undefined) {
        if (!Array.isArray(fields.medicines) || fields.medicines.length === 0) {
            throw new AppError("Medicines cannot be empty", 400);
        }
        fields.medicines.forEach((med, index) => {
            if (!med.name.trim()) {
                throw new AppError(`Medicine ${index + 1} name cannot be empty`, 400);
            }
        });
        cleaned.cleanedMedicines = fields.medicines.map((med) => ({
            name: med.name.trim(),
            dosage: med.dosage.trim(),
            duration: med.duration.trim(),
            frequency: med.frequency.trim(),
        }));
    }
    if (fields.medicalAndSurgicalHistory !== undefined) {
        if (fields.medicalAndSurgicalHistory.conditions.length === 0) {
            throw new AppError("Medical and Surgical conditions cannot be empty", 400);
        }
        fields.medicalAndSurgicalHistory.conditions.forEach((condition, index) => {
            if (!condition.trim()) {
                throw new AppError(`Condition ${index + 1} cannot be empty`, 400);
            }
        });
        const year = fields.medicalAndSurgicalHistory.year;
        if (!Number.isInteger(year) ||
            year < 1900 ||
            year > new Date().getFullYear()) {
            throw new AppError("Medical and Surgical year is invalid", 400);
        }
        if (!fields.medicalAndSurgicalHistory.notes?.trim()) {
            throw new AppError("Medical and Surgical notes cannot be empty", 400);
        }
        cleaned.cleanedMedicalAndSurgicalHistory = {
            conditions: fields.medicalAndSurgicalHistory.conditions.map((c) => c.trim()),
            type: fields.medicalAndSurgicalHistory.type,
            year,
            notes: fields.medicalAndSurgicalHistory.notes.trim(),
        };
    }
    return cleaned;
};
export default cleanPatientFieldsForUpdate;
//# sourceMappingURL=cleanPatientFieldsForUpdate.js.map