import mongoose from "mongoose";
declare const RequestIdCounterModel: mongoose.Model<{
    seq: number;
    _id?: string | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    seq: number;
    _id?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    seq: number;
    _id?: string | null;
} & Required<{
    _id: string | null;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    seq: number;
    _id?: string | null;
}, mongoose.Document<unknown, {}, {
    seq: number;
    _id?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    seq: number;
    _id?: string | null;
} & Required<{
    _id: string | null;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    seq: number;
    _id?: string | null;
} & Required<{
    _id: string | null;
}> & {
    __v: number;
}>, {
    seq: number;
    _id?: string | null;
} & Required<{
    _id: string | null;
}> & {
    __v: number;
}>;
export default RequestIdCounterModel;
//# sourceMappingURL=counterModel.d.ts.map