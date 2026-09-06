import type { Request, Response, NextFunction } from "express";
import type { PatientFieldsInput } from "../../../utils/cleanPatientFieldsForUpdate.js";
declare const updatePatientDataController: (req: Request<{
    patientId: string;
}, any, PatientFieldsInput>, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export default updatePatientDataController;
//# sourceMappingURL=updatePatientData.d.ts.map