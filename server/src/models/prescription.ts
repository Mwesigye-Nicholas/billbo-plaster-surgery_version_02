import mongoose from "mongoose";

const { model, Schema } = mongoose;

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

const prescriptionSchema = new Schema<Prescription>(
  {
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
  
  },

  {
    timestamps: true,
  },
);

const prescriptionData = model<Prescription>("prescriptionSchema", prescriptionSchema);
export default prescriptionData;
