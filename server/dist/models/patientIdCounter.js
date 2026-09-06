import { model, Schema } from "mongoose";
const patientIdCounterSchema = new Schema({
    year: { type: Number, required: true, unique: true },
    seq: { type: Number, required: true },
});
const PatientIdCounter = model("PatientIdCounter", patientIdCounterSchema);
export default PatientIdCounter;
//# sourceMappingURL=patientIdCounter.js.map