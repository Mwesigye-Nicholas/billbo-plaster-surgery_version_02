import { Schema, Types } from "mongoose";
declare const imageMetaData: import("mongoose").Model<{
    patient: Types.ObjectId;
    fileId: Types.ObjectId;
    imageType: "X-ray" | "CT-Scan" | "MRI" | "Other";
    sizeInBytes: number;
    uploadedBy: string;
    uploadedAt: NativeDate;
    isDeleted: boolean;
    originalFileName?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    patient: Types.ObjectId;
    fileId: Types.ObjectId;
    imageType: "X-ray" | "CT-Scan" | "MRI" | "Other";
    sizeInBytes: number;
    uploadedBy: string;
    uploadedAt: NativeDate;
    isDeleted: boolean;
    originalFileName?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    patient: Types.ObjectId;
    fileId: Types.ObjectId;
    imageType: "X-ray" | "CT-Scan" | "MRI" | "Other";
    sizeInBytes: number;
    uploadedBy: string;
    uploadedAt: NativeDate;
    isDeleted: boolean;
    originalFileName?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    patient: Types.ObjectId;
    fileId: Types.ObjectId;
    imageType: "X-ray" | "CT-Scan" | "MRI" | "Other";
    sizeInBytes: number;
    uploadedBy: string;
    uploadedAt: NativeDate;
    isDeleted: boolean;
    originalFileName?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    patient: Types.ObjectId;
    fileId: Types.ObjectId;
    imageType: "X-ray" | "CT-Scan" | "MRI" | "Other";
    sizeInBytes: number;
    uploadedBy: string;
    uploadedAt: NativeDate;
    isDeleted: boolean;
    originalFileName?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, Omit<import("mongoose").DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    patient: Types.ObjectId;
    fileId: Types.ObjectId;
    imageType: "X-ray" | "CT-Scan" | "MRI" | "Other";
    sizeInBytes: number;
    uploadedBy: string;
    uploadedAt: NativeDate;
    isDeleted: boolean;
    originalFileName?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    patient: Types.ObjectId;
    fileId: Types.ObjectId;
    imageType: "X-ray" | "CT-Scan" | "MRI" | "Other";
    sizeInBytes: number;
    uploadedBy: string;
    uploadedAt: NativeDate;
    isDeleted: boolean;
    originalFileName?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>, {
    patient: Types.ObjectId;
    fileId: Types.ObjectId;
    imageType: "X-ray" | "CT-Scan" | "MRI" | "Other";
    sizeInBytes: number;
    uploadedBy: string;
    uploadedAt: NativeDate;
    isDeleted: boolean;
    originalFileName?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export default imageMetaData;
//# sourceMappingURL=imageMetaData.d.ts.map