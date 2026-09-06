import express from "express";
import refreshTokenController from "../controllers/userControllers/refreshTokenController.js";
const refreshRouter = express.Router();
refreshRouter.post("/refresh", refreshTokenController);
export default refreshRouter;
//# sourceMappingURL=refreshTokenRouter.js.map