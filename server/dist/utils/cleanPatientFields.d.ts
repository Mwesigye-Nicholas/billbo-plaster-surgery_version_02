interface MedicineInput {
    name: string;
    dosage: string;
    duration: string;
    frequency: string;
}
interface medicalAndSurgicalHistoryInput {
    conditions: string[];
    category: "medical" | "surgical";
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
    dateOfSurgery?: Date;
    dateOfVisit?: Date;
    medicines?: MedicineInput[];
    medicalAndSurgicalHistory?: medicalAndSurgicalHistoryInput;
}
export interface PatientReqObj {
    cleanedName: string;
    cleanedDateOfBirth: Date;
    cleanedSex: string;
    cleanedAddress: string;
    cleanedEmail: string;
    cleanedPhoneNumbers: {
        type: "home" | "work" | "mobile" | "emergency" | "relative";
        number: string;
    }[];
    cleanedDiagnosis: string[];
    cleanedStatus: string;
    cleanedPlannedProcedure: string;
    cleanedDateOfSurgery: Date;
    cleanedDateOfVisit: Date;
    cleanedMedicines: MedicineInput[];
    cleanedMedicalAndSurgicalHistory: medicalAndSurgicalHistoryInput;
}
declare const cleanPatientFields: (fields: PatientFieldsInput) => PatientReqObj;
export default cleanPatientFields;
//# sourceMappingURL=cleanPatientFields.d.ts.map