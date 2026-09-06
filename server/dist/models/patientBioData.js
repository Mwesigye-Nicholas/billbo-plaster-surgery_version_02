import mongoose from "mongoose";
const { Schema, model } = mongoose;
const patientBioDataSchema = new Schema({
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
            validator: function (value) {
                return /^[a-zA-Z\s.'-]+$/.test(value);
            },
            message: "Name must contain only letters and spaces.",
        },
    },
    dateOfBirth: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
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
            message: "Sex must be one of: 'male', 'female', 'other', 'prefer_not_to_say'",
        },
        lowercase: true,
    },
    address: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
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
            validator: function (value) {
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
                    validator: function (value) {
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
}, { timestamps: true });
patientBioDataSchema.index({ patientId: 1 });
patientBioDataSchema.index({ email: 1 });
patientBioDataSchema.index({ "phoneNumbers.number": 1 });
patientBioDataSchema.index({ name: 1 });
const patientBioData = model("patientBioData", patientBioDataSchema);
export default patientBioData;
//# sourceMappingURL=patientBioData.js.map