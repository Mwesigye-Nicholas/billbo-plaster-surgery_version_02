import mongoose from "mongoose";

const { Schema, model } = mongoose;

const patientMedicalDataSchema = new Schema(
  {
    diagnosis: {
      type: [String],
      required: [true, "diagnosis is required"],
      validate: {
        validator: function (value: string[]) {
          return (
            Array.isArray(value) &&
            value.length > 0 &&
            value.every(
              (item) => typeof item === "string" && item.trim() !== "",
            )
          );
        },
        message: "Diagnosis must be a non-empty array of valid strings.",
      },
    },
    status: {
      type: String,
      required: true,
      enum: [
        "waiting",
        "booked",
        "in_progress",
        "completed",
        "canceled",
        "discharged",
        "postponed",
      ],
      lowercase: true,
    },
    plannedProcedure: {
      type: String,
      validate: {
        validator: function (value: string) {
          return /^[a-zA-Z0-9\s,.'()/-]{3,}$/.test(value);
        },
        message: "Planned procedure should contain only string and space",
      },
    },
    dateOfSurgery: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          return value instanceof Date && !isNaN(value.getTime());
        },
        message: "Invalid date of surgery.Must be a valid date.",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "surgeonData",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "surgeonData",
    },
    dateOfVisit: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
          return value instanceof Date && !isNaN(value.getTime());
        },
        message: "Invalid date of Visit. Must be a valid date.",
      },
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
        duration: { 
          type: String,
          required: true,
          trim: true,
        },
        frequency: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    medicalAndSurgicalHistory: {
      type: {
        conditions: {
          type: [String],
          required: [true, "Condition is required"],
          validate: {
            validator: function (value: string[]) {
              return (
                Array.isArray(value) &&
                value.length > 0 &&
                value.every(
                  (item) => typeof item === "string" && item.trim() !== "",
                )
              );
            },
          },
        },
        category: {
          type: String,
          enum: ["medical", "surgical"],
          required: true,
          lowercase: true,
        },
        year: {
          type: Number,
          required: true,
          min: 1900,
          max: new Date().getFullYear(),
        },
        notes: {
          type: String,
          trim: true,
          required: true,
        },
      },
      required: true,
    },

    surgeon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SurgeonData",
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patientBioData",
      required: true,
    },
    requestId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true },
);
patientMedicalDataSchema.index(
  {
    diagnosis: 1,
    dateOfVisit: 1,
    patient: 1,
    plannedProcedure: 1,
  },
  { unique: true },
);

const patientMedicalData = model(
  "patientMedicalData",
  patientMedicalDataSchema,
);
export default patientMedicalData;
