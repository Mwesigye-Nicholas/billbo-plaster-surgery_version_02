import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError.js"

const handleUnmatchedRoutes = ( req: Request, res: Response, next: NextFunction) => {
    return next(new AppError(`Route ${req.originalUrl} not found`, 404));
}
export default handleUnmatchedRoutes;