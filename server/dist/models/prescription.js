import mongoose from "mongoose";
const { model, Schema } = mongoose;
const prescriptionSchema = new Schema({
    patientBioData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "patientBioData",
        required: true,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SurgeonData",
        required: true,
    },
    medicalData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "patientMedicalData",
        required: true,
    },
    medicines: [
        {
            name: {
                type: String,
                required: true,
                trim: true,
            },
            dosage: {
                type: String,
                required: true,
                trim: true,
            },
            frequency: {
                type: String,
                required: true,
                trim: true,
            },
            duration: {
                type: String,
                trim: true,
                required: true,
            },
            route: {
                type: String,
                trim: true,
                required: true,
            },
            instructions: {
                type: String,
                trim: true,
                required: true,
            },
        },
    ],
    isActive: {
        type: Boolean,
        default: true,
    },
    issuedOn: {
        type: Date,
        required: true,
        default: Date.now,
    },
}, {
    timestamps: true,
});
const prescriptionData = model("prescriptionSchema", prescriptionSchema);
export default prescriptionData;
//# sourceMappingURL=prescription.js.map