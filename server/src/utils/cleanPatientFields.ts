import AppError from "./appError.js";

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

const cleanPatientFields = (fields: PatientFieldsInput): PatientReqObj => {
  const {
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
  } = fields;



  // Validate mandatory fields. You can refine optional fields later.
  if (
    !name?.trim() ||
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
    medicalAndSurgicalHistory.conditions.length === 0
  ) {
    throw new AppError("All required fields must be provided", 400);
  }

  if (!medicalAndSurgicalHistory) {
    throw new AppError("Medical and surgical field should be provided", 400)
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
