import express from "express";
import authenticateToken from "../middlewares/authenticateUser.js";
import createPatientController from "../controllers/patientControllers/patientDataControllers/createPatient.js";
import deletePatientController from "../controllers/patientControllers/patientDataControllers/deletePatientData.js";
import getAllPatientsController from "../controllers/patientControllers/patientDataControllers/getAllPatientData.js";
import getPatientsWithSpecificConditionController from "../controllers/patientControllers/patientDataControllers/getPatientWithSpecificCondition.js";
import getPatientWithSpecificPatientNumber from "../controllers/patientControllers/patientDataControllers/getPatientWithSpecificPatientNumber.js";
import updatePatientDataController from "../controllers/patientControllers/patientDataControllers/updatePatientData.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";


const patientRoutes = express.Router();
patientRoutes.use(authenticateToken)

patientRoutes.get("/", getAllPatientsController);
patientRoutes.get("/search/:condition", getPatientsWithSpecificConditionController);
patientRoutes.get("/:patientId", getPatientWithSpecificPatientNumber);
patientRoutes.post("/",  authorizeRoles("admin", "doctor", "surgeon"), createPatientController);
patientRoutes.delete("/:patientId", authorizeRoles("admin"), deletePatientController);
patientRoutes.put("/:patientId", authorizeRoles("admin", "doctor", "surgeon"), updatePatientDataController);

export default patientRoutes;