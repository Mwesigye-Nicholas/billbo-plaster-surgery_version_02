import { NODE_ENV } from "../config/env.js";
import AppError from "../utils/appError.js";
const errorHandler = (error, req, res, next) => {
    const statusCode = (error instanceof AppError ? error.statusCode : 500) || 500;
    const message = error.message || "Internal Server Error";
    if (NODE_ENV === "development") {
        return res.status(statusCode).json({
            success: false,
            message,
            stack: error.stack
        });
    }
    // Production
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    });
};
export default errorHandler;
//# sourceMappingURL=errorHandler.js.map