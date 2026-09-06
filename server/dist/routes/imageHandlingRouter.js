import express from "express";
import allowDoctorsAndSurgeonsController from "../middlewares/allowDoctorsAndSurgeons.js";
import authenticateToken from "../middlewares/authenticateUser.js";
import getImagesByPatientId from "../controllers/patientControllers/patientImageControllers/getPatientImagesData.js";
import streamPatientImage from "../controllers/patientControllers/patientImageControllers/streamPatientImage.js";
import deletePatientImage from "../controllers/patientControllers/patientImageControllers/deletePatientImage.js";
import addPatientImages from "../controllers/patientControllers/patientImageControllers/addPatientImage.js";
import { uploadPatientImages } from "../middlewares/uploadPatientImages.js";
const imagesRouter = express.Router();
imagesRouter.get("/images/:imageId", streamPatientImage);
imagesRouter.use(authenticateToken, allowDoctorsAndSurgeonsController);
imagesRouter.get("/imageMetadata/:patientId", getImagesByPatientId);
imagesRouter.delete("/images/:imageId", deletePatientImage);
imagesRouter.post("/images/:patientId", uploadPatientImages.array("images", 6), addPatientImages);
export default imagesRouter;
//# sourceMappingURL=imageHandlingRouter.js.map