import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import refreshRouter from "./routes/refreshTokenRouter.js";
import AppError from "./utils/appError.js";
import errorHandler from "./middlewares/errorHandler.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import imagesRouter from "./routes/imageHandlingRouter.js";
const app = express();
const allowedOrigin = [
    "http://localhost:5173",
    //domain url for frontEnd, TO PUT LATER
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigin.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    //methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
//*middleware to parse Json
app.use(express.json());
//*middleware to purse URL-encoded data
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/users", userRouter);
app.use("/api/token", refreshRouter);
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/prescriptions", prescriptionRoutes);
app.use("/api/patients/v1/stream", imagesRouter);
app.use((req, res, next) => {
    return next(new AppError(`Route ${req.originalUrl} not found`, 404));
});
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map