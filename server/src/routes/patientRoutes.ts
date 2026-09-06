import express from "express"
import allowDoctorsAndSurgeonsController from "../middlewares/allowDoctorsAndSurgeons.js";
import authenticateToken from "../middlewares/authenticateUser.js";
import createPatientController from "../controllers/patientControllers/patientDataControllers/createPatient.js";
import deletePatientController from "../controllers/patientControllers/patientDataControllers/deletePatientData.js";
import getAllPatientsController from "../controllers/patientControllers/patientDataControllers/getAllPatientData.js";
import getPatientsWithSpecificConditionController from "../controllers/patientControllers/patientDataControllers/getPatientWithSpecificCondition.js";
import getPatientWithSpecificPatientNumber from "../controllers/patientControllers/patientDataControllers/getPatientWithSpecificPatientNumber.js";
import updatePatientDataController from "../controllers/patientControllers/patientDataControllers/updatePatientData.js";


const patientRoutes = express.Router();
patientRoutes.use(authenticateToken)

patientRoutes.get("/", getAllPatientsController);
patientRoutes.get("/search/:condition", getPatientsWithSpecificConditionController);
patientRoutes.get("/:patientId", getPatientWithSpecificPatientNumber);
patientRoutes.post("/",  allowDoctorsAndSurgeonsController, createPatientController);
patientRoutes.delete("/:patientId", allowDoctorsAndSurgeonsController, deletePatientController);
patientRoutes.put("/:patientId", allowDoctorsAndSurgeonsController, updatePatientDataController);

export default patientRoutes;