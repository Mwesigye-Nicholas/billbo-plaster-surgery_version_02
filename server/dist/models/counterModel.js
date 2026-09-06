import mongoose from "mongoose";
const { Schema, model } = mongoose;
const counterSchema = new Schema({
    _id: {
        type: String,
        require: true
    },
    seq: {
        type: Number,
        default: 0,
    }
});
const RequestIdCounterModel = model("RequestIdCounter", counterSchema);
export default RequestIdCounterModel;
//# sourceMappingURL=counterModel.js.map