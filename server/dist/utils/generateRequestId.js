import counterModel from "../models/counterModel.js";
import dayjs from "dayjs";
const generateRequestId = async (session) => {
    const year = dayjs().year();
    const counterId = `requestId_${year}`;
    const counter = await counterModel.findOneAndUpdate({
        _id: counterId
    }, {
        $inc: { seq: 1 }
    }, {
        new: true,
        upsert: true,
        session
    });
    const sequence = counter.seq.toString().padStart(5, "0");
    return `REQ-${year}-${sequence}`;
};
export default generateRequestId;
//# sourceMappingURL=generateRequestId.js.map