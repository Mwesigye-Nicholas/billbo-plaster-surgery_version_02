import express from "express";
import createPrescription from "../controllers/patientControllers/prescriptionControllers/createPrescription.js";
import authenticateToken from "../middlewares/authenticateUser.js";
import allowDoctorsAndSurgeonsController from "../middlewares/allowDoctorsAndSurgeons.js";
const prescriptionRoutes = express.Router();
prescriptionRoutes.use(authenticateToken, allowDoctorsAndSurgeonsController);
prescriptionRoutes.post("/:patientId", createPrescription);
export default prescriptionRoutes;
//# sourceMappingURL=prescriptionRoutes.js.map