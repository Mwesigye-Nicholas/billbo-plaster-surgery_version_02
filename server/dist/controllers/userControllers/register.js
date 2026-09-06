import AppError from "../../utils/appError.js";
import SurgeonData from "../../models/surgeonData.js";
import passwordGenerator from "../../utils/passwordGenerator.js";
import cleanUserReqObj from "../../utils/cleanUserReqObj.js";
const registerController = async (req, res, next) => {
    const { name, email, role, password } = req.body;
    const cleaned = cleanUserReqObj(name, email, role, password);
    const { cleanedName, cleanedEmail, cleanedRole, cleanedPassword } = cleaned;
    const allowedRoles = ["surgeon", "assistant", "admin"];
    if (!allowedRoles.includes(cleanedRole)) {
        return next(new AppError("Invalid role type", 400));
    }
    try {
        const existingUser = await SurgeonData.findOne({ email: cleanedEmail });
        if (existingUser) {
            const message = "Doctor with this Email already exists";
            const statusCode = 400;
            return next(new AppError(message, statusCode));
        }
        const securePassword = await passwordGenerator(cleanedPassword);
        const surgeon = new SurgeonData({
            name: cleanedName,
            email: cleanedEmail,
            role: cleanedRole,
            password: securePassword,
        });
        const createdSurgeon = await surgeon.save();
        return res.status(201).json({
            createdSurgeonId: createdSurgeon._id,
            success: true,
            message: `${createdSurgeon.name}, registered successfully.`,
        });
    }
    catch (error) {
        if (error instanceof AppError)
            return next(error);
        return next(new AppError("Internal Server Error", 500));
    }
};
export default registerController;
//# sourceMappingURL=register.js.map