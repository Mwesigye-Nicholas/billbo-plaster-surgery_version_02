import express from "express";
import getRegisteredPatients from "../controllers/patientControllers/registrationControllers/getRegisteredPatients";
import registerNewPatient from "../controllers/patientControllers/registrationControllers/registerNewPatient";
import deletePatientRegData from "../controllers/patientControllers/registrationControllers/deleteRegistrationData";
import updatePatientRegistrationData from "../controllers/patientControllers/registrationControllers/editRegistrationData";
import authenticateToken from "../middlewares/authenticateUser";
import authorizeRoles from "../middlewares/authorizeRoles";

const patientRegistrationRoutes = express.Router();

patientRegistrationRoutes.use(authenticateToken);

patientRegistrationRoutes.get("/", getRegisteredPatients);
patientRegistrationRoutes.post("/", registerNewPatient);
patientRegistrationRoutes.delete(
  "/:patientId", authorizeRoles("admin"),
  deletePatientRegData,
);
patientRegistrationRoutes.patch(
  "/:patientId",
  updatePatientRegistrationData,
);

export default patientRegistrationRoutes;
