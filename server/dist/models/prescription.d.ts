import mongoose from "mongoose";
interface Medicine {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    route: string;
    instructions: string;
}
interface Prescription {
    patientBioData: mongoose.Types.ObjectId;
    doctorId: mongoose.Types.ObjectId;
    medicalData: mongoose.Types.ObjectId;
    medicines: Medicine[];
    issuedOn: Date;
    isActive: boolean;
}
declare const prescriptionData: mongoose.Model<Prescription, {}, {}, {}, mongoose.Document<unknown, {}, Prescription, {}, mongoose.DefaultSchemaOptions> & Prescription & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, Prescription>;
export default prescriptionData;
//# sourceMappingURL=prescription.d.ts.map