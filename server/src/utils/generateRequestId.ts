import counterModel from "../models/counterModel.js";
import dayjs from "dayjs";
import type {ClientSession} from "mongoose";

const generateRequestId = async (session: ClientSession) => {

    const year = dayjs().year();
    const counterId = `requestId_${year}`;

    const counter = await counterModel.findOneAndUpdate(
        {
            _id: counterId
        },
        {
            $inc: { seq: 1}
        }, {
            new: true,
            upsert: true,
            session
        }
    )
    const sequence = counter.seq.toString().padStart(5, "0");
    return `REQ-${year}-${sequence}`;
}
export default generateRequestId;