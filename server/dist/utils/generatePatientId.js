import dayjs from "dayjs";
import PatientIdCounter from "../models/patientIdCounter.js";
async function generatePatientId(session) {
    const year = dayjs().year();
    const counter = await PatientIdCounter.findOneAndUpdate({ year }, { $inc: { seq: 1 } }, { new: true, upsert: true, session });
    const seq = counter.seq;
    const padded = seq.toString();
    return `${year}-${padded}`;
}
export default generatePatientId;
//# sourceMappingURL=generatePatientId.js.map