interface MedicinesInput {
    name: string;
    dosage: string;
    duration: string;
    frequency: string;
}
interface MedicalAndSurgicalHistoryInput {
    conditions: string[];
    type: "medical" | "surgical";
    year: number;
    notes: string;
}
export interface PatientFieldsInput {
    name?: string;
    dateOfBirth?: Date;
    sex?: string;
    address?: string;
    email?: string;
    phoneNumbers?: {
        type: "home" | "work" | "mobile" | "emergency" | "relative";
        number: string;
    }[];
    diagnosis?: string[];
    status?: string;
    plannedProcedure?: string;
    dateOfSurgery?: string;
    requestId?: string;
    medicines?: MedicinesInput[];
    medicalAndSurgicalHistory?: MedicalAndSurgicalHistoryInput;
}
export interface PatientReqObj {
    cleanedName?: string;
    cleanedDateOfBirth?: Date | string;
    cleanedSex?: string;
    cleanedAddress?: string;
    cleanedEmail?: string;
    cleanedPhoneNumbers?: {
        type: "home" | "work" | "mobile" | "emergency" | "relative";
        number: string;
    }[];
    cleanedDiagnosis?: string[];
    cleanedStatus?: string;
    cleanedPlannedProcedure?: string;
    cleanedDateOfSurgery?: string;
    cleanedRequestId?: string;
    cleanedMedicines?: MedicinesInput[];
    cleanedMedicalAndSurgicalHistory?: MedicalAndSurgicalHistoryInput;
}
declare const cleanPatientFieldsForUpdate: (fields: PatientFieldsInput) => PatientReqObj;
export default cleanPatientFieldsForUpdate;
//# sourceMappingURL=cleanPatientFieldsForUpdate.d.ts.map