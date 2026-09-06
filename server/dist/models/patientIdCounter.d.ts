import { Schema } from "mongoose";
interface PatientIdCounterDoc {
    year: number;
    seq: number;
}
declare const PatientIdCounter: import("mongoose").Model<PatientIdCounterDoc, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, PatientIdCounterDoc, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PatientIdCounterDoc & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<PatientIdCounterDoc, import("mongoose").Model<PatientIdCounterDoc, any, any, any, any, any, PatientIdCounterDoc>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PatientIdCounterDoc, import("mongoose").Document<unknown, {}, PatientIdCounterDoc, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PatientIdCounterDoc & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    year?: import("mongoose").SchemaDefinitionProperty<number, PatientIdCounterDoc, import("mongoose").Document<unknown, {}, PatientIdCounterDoc, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PatientIdCounterDoc & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    seq?: import("mongoose").SchemaDefinitionProperty<number, PatientIdCounterDoc, import("mongoose").Document<unknown, {}, PatientIdCounterDoc, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PatientIdCounterDoc & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, PatientIdCounterDoc>, PatientIdCounterDoc>;
export default PatientIdCounter;
//# sourceMappingURL=patientIdCounter.d.ts.map