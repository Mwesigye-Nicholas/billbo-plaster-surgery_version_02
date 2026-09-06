import mongoose from "mongoose";
interface PhoneNumber {
    type: "home" | "work" | "mobile" | "emergency" | "relative";
    number: string;
}
export interface PatientData {
    patientId: string;
    imageCount: number;
    name: string;
    dateOfBirth: Date;
    sex: "male" | "female" | "other" | "prefer_not_to_say";
    address: string;
    email: string;
    phoneNumbers: PhoneNumber[];
    createdBy: mongoose.Types.ObjectId;
    updatedBy?: mongoose.Types.ObjectId;
    medicalData: mongoose.Types.ObjectId[];
}
declare const patientBioData: mongoose.Model<PatientData, {}, {}, {}, mongoose.Document<unknown, {}, PatientData, {}, mongoose.DefaultSchemaOptions> & PatientData & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, PatientData>;
export default patientBioData;
//# sourceMappingURL=patientBioData.d.ts.map