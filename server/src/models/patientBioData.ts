import mongoose from "mongoose";

interface PhoneNumber {
  type: "home" | "work" | "mobile" | "emergency" | "relative",
  number: string,

}

export interface PatientData {
  patientId: string,
  imageCount: number,
  name: string,
  dateOfBirth: Date,
  sex: "male" | "female" | "other" | "prefer_not_to_say" ,
  address: string,
  email: string,
  phoneNumbers: PhoneNumber[],
  createdBy: mongoose.Types.ObjectId,
  updatedBy?: mongoose.Types.ObjectId,
  medicalData: mongoose.Types.ObjectId[],

}

const { Schema, model } = mongoose;
const patientBioDataSchema = new Schema<PatientData>(
  {
    patientId: {
      type: String,
      unique: true,
      required: true,
    },
    imageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    name: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return /^[a-zA-Z\s.'-]+$/.test(value);
        },
        message: "Name must contain only letters and spaces.",
      },
    },
    dateOfBirth: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
          return value instanceof Date && !isNaN(value.getTime());
        },
        message: "Invalid date of birth.Must be a valid Date of birth.",
      },
    },
    sex: {
      type: String,
      required: [true, "Sex is required"],
      enum: {
        values: ["male", "female", "other", "prefer_not_to_say"],
        message:
          "Sex must be one of: 'male', 'female', 'other', 'prefer_not_to_say'",
      },
      lowercase: true,
    },
    address: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return /^[a-zA-Z0-9\s,.'#()-]{3,}$/.test(value);
        },
        message: "Invalid address.",
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: function (value: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid Email address.",
      },
    },
    phoneNumbers: [
      {
        type: {
          type: String,
          enum: ["home", "work", "mobile", "emergency", "relative"],
          required: true,
        },
        number: {
          type: String,
          required: true,
          validate: {
            validator: function (value: string) {
              return /^\+?[0-9\s-]{7,15}$/.test(value);
            },
            message: "Invalid phone number format.",
          },
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "surgeonData",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "surgeonData",
    },
    medicalData: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "patientMedicalData",
      },
    ],
  },
  { timestamps: true },
);
patientBioDataSchema.index({ patientId: 1 });
patientBioDataSchema.index({ email: 1 });
patientBioDataSchema.index({"phoneNumbers.number": 1})
patientBioDataSchema.index({ name: 1 });

const patientBioData = model<PatientData>("patientBioData", patientBioDataSchema);
export default patientBioData;
