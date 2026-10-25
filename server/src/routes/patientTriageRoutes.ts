import express from "express";
import deleteAllPatientTriageHistroy from "../controllers/patientControllers/triageControllers/deletePatientVitals";
import enterPatientVitals from "../controllers/patientControllers/triageControllers/enterPatientVitals";
import getPatientTriageHistory from "../controllers/patientControllers/triageControllers/getPatientVitals";
import updatePatientTriageData from "../controllers/patientControllers/triageControllers/updatePatientVitals";
import authenticateToken from "../middlewares/authenticateUser";
import authorizeRoles from "../middlewares/authorizeRoles";

const patientTriageRoutes = express.Router();

patientTriageRoutes.use(authenticateToken);

patientTriageRoutes.get("/", getPatientTriageHistory);
patientTriageRoutes.post("/", enterPatientVitals);
patientTriageRoutes.delete("/", authorizeRoles("admin"), deleteAllPatientTriageHistroy);
patientTriageRoutes.patch("/:triageId", updatePatientTriageData);

export default patientTriageRoutes;
