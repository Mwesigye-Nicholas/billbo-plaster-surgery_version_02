import mongoose from "mongoose";

const { Schema, model } = mongoose;

const surgeonDataSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return /^[a-zA-Z\s]+$/.test(value);
        },
        message: "Name must contain only letters and spaces.",
      },
    },
    role: {
        type: String,
        enum: ["surgeon", "admin", "assistant"],
        required: true,
      
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return typeof value === "string";
        },
        message: "Password must be a string.",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (value: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Email must be a valid email address.",
      },
    },
    assignedPatients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "patientBioData",
      },
    ],
  },
  { timestamps: true }
);
const SurgeonData = model("SurgeonData", surgeonDataSchema);
export default SurgeonData;
