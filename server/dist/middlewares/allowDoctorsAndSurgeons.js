import AppError from "../utils/appError.js";
const allowDoctorsAndSurgeonsController = (req, res, next) => {
    const allowedRoles = ["surgeon", "assistant", "admin", "doctor"];
    const user = req.user;
    console.log("User: ", user);
    if (!user) {
        return next(new AppError("Unauthorized Access", 401));
    }
    const { role } = user;
    if (!allowedRoles.includes(role)) {
        return next(new AppError("Invalid role", 403));
    }
    next();
};
export default allowDoctorsAndSurgeonsController;
//# sourceMappingURL=allowDoctorsAndSurgeons.js.map