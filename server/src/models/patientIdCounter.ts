import { model, Schema } from "mongoose";

interface PatientIdCounterDoc {
  year: number;
  seq: number;
}
const patientIdCounterSchema = new Schema<PatientIdCounterDoc>({
  year: { type: Number, required: true, unique: true },
  seq: { type: Number, required: true },
});
const PatientIdCounter = model("PatientIdCounter", patientIdCounterSchema);
export default PatientIdCounter;
