import AppError from "../utils/appError.js";
const handleUnmatchedRoutes = (req, res, next) => {
    return next(new AppError(`Route ${req.originalUrl} not found`, 404));
};
export default handleUnmatchedRoutes;
//# sourceMappingURL=unmatchedRoutesController.js.map