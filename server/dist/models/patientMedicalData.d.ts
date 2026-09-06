import mongoose from "mongoose";
declare const patientMedicalData: mongoose.Model<{
    createdBy: mongoose.Types.ObjectId;
    diagnosis: string[];
    status: "waiting" | "booked" | "in_progress" | "completed" | "canceled" | "discharged" | "postponed";
    dateOfVisit: NativeDate;
    medicines: mongoose.Types.DocumentArray<{
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }, {}, {}> & {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }>;
    medicalAndSurgicalHistory: {
        year: number;
        conditions: string[];
        category: "medical" | "surgical";
        notes: string;
    };
    patient: mongoose.Types.ObjectId;
    requestId: string;
    surgeon?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    plannedProcedure?: string | null;
    dateOfSurgery?: NativeDate | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    createdBy: mongoose.Types.ObjectId;
    diagnosis: string[];
    status: "waiting" | "booked" | "in_progress" | "completed" | "canceled" | "discharged" | "postponed";
    dateOfVisit: NativeDate;
    medicines: mongoose.Types.DocumentArray<{
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }, {}, {}> & {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }>;
    medicalAndSurgicalHistory: {
        year: number;
        conditions: string[];
        category: "medical" | "surgical";
        notes: string;
    };
    patient: mongoose.Types.ObjectId;
    requestId: string;
    surgeon?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    plannedProcedure?: string | null;
    dateOfSurgery?: NativeDate | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    createdBy: mongoose.Types.ObjectId;
    diagnosis: string[];
    status: "waiting" | "booked" | "in_progress" | "completed" | "canceled" | "discharged" | "postponed";
    dateOfVisit: NativeDate;
    medicines: mongoose.Types.DocumentArray<{
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }, {}, {}> & {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }>;
    medicalAndSurgicalHistory: {
        year: number;
        conditions: string[];
        category: "medical" | "surgical";
        notes: string;
    };
    patient: mongoose.Types.ObjectId;
    requestId: string;
    surgeon?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    plannedProcedure?: string | null;
    dateOfSurgery?: NativeDate | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdBy: mongoose.Types.ObjectId;
    diagnosis: string[];
    status: "waiting" | "booked" | "in_progress" | "completed" | "canceled" | "discharged" | "postponed";
    dateOfVisit: NativeDate;
    medicines: mongoose.Types.DocumentArray<{
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }, {}, {}> & {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }>;
    medicalAndSurgicalHistory: {
        year: number;
        conditions: string[];
        category: "medical" | "surgical";
        notes: string;
    };
    patient: mongoose.Types.ObjectId;
    requestId: string;
    surgeon?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    plannedProcedure?: string | null;
    dateOfSurgery?: NativeDate | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    createdBy: mongoose.Types.ObjectId;
    diagnosis: string[];
    status: "waiting" | "booked" | "in_progress" | "completed" | "canceled" | "discharged" | "postponed";
    dateOfVisit: NativeDate;
    medicines: mongoose.Types.DocumentArray<{
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }, {}, {}> & {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }>;
    medicalAndSurgicalHistory: {
        year: number;
        conditions: string[];
        category: "medical" | "surgical";
        notes: string;
    };
    patient: mongoose.Types.ObjectId;
    requestId: string;
    surgeon?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    plannedProcedure?: string | null;
    dateOfSurgery?: NativeDate | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    createdBy: mongoose.Types.ObjectId;
    diagnosis: string[];
    status: "waiting" | "booked" | "in_progress" | "completed" | "canceled" | "discharged" | "postponed";
    dateOfVisit: NativeDate;
    medicines: mongoose.Types.DocumentArray<{
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }, {}, {}> & {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }>;
    medicalAndSurgicalHistory: {
        year: number;
        conditions: string[];
        category: "medical" | "surgical";
        notes: string;
    };
    patient: mongoose.Types.ObjectId;
    requestId: string;
    surgeon?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    plannedProcedure?: string | null;
    dateOfSurgery?: NativeDate | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    createdBy: mongoose.Types.ObjectId;
    diagnosis: string[];
    status: "waiting" | "booked" | "in_progress" | "completed" | "canceled" | "discharged" | "postponed";
    dateOfVisit: NativeDate;
    medicines: mongoose.Types.DocumentArray<{
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }, {}, {}> & {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }>;
    medicalAndSurgicalHistory: {
        year: number;
        conditions: string[];
        category: "medical" | "surgical";
        notes: string;
    };
    patient: mongoose.Types.ObjectId;
    requestId: string;
    surgeon?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    plannedProcedure?: string | null;
    dateOfSurgery?: NativeDate | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    createdBy: mongoose.Types.ObjectId;
    diagnosis: string[];
    status: "waiting" | "booked" | "in_progress" | "completed" | "canceled" | "discharged" | "postponed";
    dateOfVisit: NativeDate;
    medicines: mongoose.Types.DocumentArray<{
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }, {}, {}> & {
        name: string;
        dosage: string;
        duration: string;
        frequency: string;
    }>;
    medicalAndSurgicalHistory: {
        year: number;
        conditions: string[];
        category: "medical" | "surgical";
        notes: string;
    };
    patient: mongoose.Types.ObjectId;
    requestId: string;
    surgeon?: mongoose.Types.ObjectId | null;
    updatedBy?: mongoose.Types.ObjectId | null;
    plannedProcedure?: string | null;
    dateOfSurgery?: NativeDate | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default patientMedicalData;
//# sourceMappingURL=patientMedicalData.d.ts.map