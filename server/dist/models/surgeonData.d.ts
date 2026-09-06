import mongoose from "mongoose";
declare const SurgeonData: mongoose.Model<{
    name: string;
    email: string;
    role: "surgeon" | "admin" | "assistant";
    password: string;
    assignedPatients: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    role: "surgeon" | "admin" | "assistant";
    password: string;
    assignedPatients: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    email: string;
    role: "surgeon" | "admin" | "assistant";
    password: string;
    assignedPatients: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    email: string;
    role: "surgeon" | "admin" | "assistant";
    password: string;
    assignedPatients: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    role: "surgeon" | "admin" | "assistant";
    password: string;
    assignedPatients: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    name: string;
    email: string;
    role: "surgeon" | "admin" | "assistant";
    password: string;
    assignedPatients: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    name: string;
    email: string;
    role: "surgeon" | "admin" | "assistant";
    password: string;
    assignedPatients: mongoose.Types.ObjectId[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    email: string;
    role: "surgeon" | "admin" | "assistant";
    password: string;
    assignedPatients: mongoose.Types.ObjectId[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default SurgeonData;
//# sourceMappingURL=surgeonData.d.ts.map