import express from "express";

import createPrescription from "../controllers/patientControllers/prescriptionControllers/createPrescription.js";
import authenticateToken from "../middlewares/authenticateUser.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const prescriptionRoutes = express.Router();
prescriptionRoutes.use(authenticateToken, authorizeRoles("admin", "doctor", "surgeon"));

prescriptionRoutes.post("/:patientId", createPrescription);

export default prescriptionRoutes;