import mongoose from "mongoose";

const { Schema, model } = mongoose;

type Sex = "Male" | "Female" | "Prefer Not Say";

interface PhoneNumber {
  phoneType: "Home" | "Work" | "Mobile";
  number: string;
}

interface NextOfKin {
  name: string;
  contactNumber: string[];
}

type Registration = {
  name: string;
  sex: Sex;
  address: string;
  dateOfBirth: Date;
  phoneNumbers: PhoneNumber[];
  email: string;
  nextOfKin: NextOfKin;
  patientId: string;
};

const registrationDataSchema = new Schema<Registration>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (name: string) {
          return /^[a-zA-Z\s]+$/.test(name);
        },
        message: "Name must contain only letters and spaces.",
      },
      minLength: [2, "Name must be at least 2 characters but got {VALUE}"],
    },
    patientId: {
      type: String,
      required: true,
      trim: true,
    },
    sex: {
      type: String,
      required: [true, "Sex is required"],
      enum: {
        values: ["Male", "Female", "Prefer Not Say"],
        message:
          "Sex must have one of these values: Male, Female or Prefer not to Say",
      },
    },
    address: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (address: string) {
          return /^[a-zA-Z0-9\s,.'#()-]{3,}$/.test(address);
        },
        message: "Invalid Address",
      },
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (email: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Invalid Email Address",
      },
      lowercase: true,
      trim: true,
    },

    phoneNumbers: [
      {
        phoneType: {
          type: String,
          enum: {
            values: ["Home", "Work", "Mobile"],
            message: "Phone number should be either: Home, Work or Mobile",
          },
          required: true,
        },

        number: {
          type: String,
          required: true,
          trim: true,
          validate: {
            validator: function (number: string) {
              return /^\+256[0-9]{9}$/;
            },
            message: "Invalid Phone Number Format",
          },
        },
      },
    ],

    dateOfBirth: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
          return value instanceof Date && !isNaN(value.getTime());
        },
      },
    },
    nextOfKin: {
      name: {
        type: String,
        required: true,
        trim: true,
        validate: {
          validator: function (name: string) {
            return /^[a-zA-Z\s]+$/.test(name);
          },
          message: "Name must contain only letters and spaces.",
        },
        min: [2, "Name must be at least 2 charaters but got {VALUE}"],
      },

      contactNumber: [
        {
          type: String,
          required: true,
          trim: true,
          validate: {
            validator: function (phone_number: string) {
              return phone_number.length >= 10;
            },
          },
        },
      ],
    },
  },

  { timestamps: true },
);

const Registration = model<Registration>(
  "Registration",
  registrationDataSchema,
);

registrationDataSchema.index({ name: 1 });
registrationDataSchema.index({ patientId: 1 }, { unique: true });

await Registration.createIndexes();

export default Registration;
