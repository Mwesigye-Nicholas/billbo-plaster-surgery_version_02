import express from "express";
import loginController from "../controllers/userControllers/login.js";
import logoutController from "../controllers/userControllers/logout.js";
import registerController from "../controllers/userControllers/register.js";
const userRouter = express.Router();
userRouter.post("/login", loginController);
userRouter.post("/logout", logoutController);
userRouter.post("/register", registerController);
export default userRouter;
//# sourceMappingURL=userRoutes.js.map