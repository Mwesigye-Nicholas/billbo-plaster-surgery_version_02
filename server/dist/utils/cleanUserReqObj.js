import AppError from "./appError.js";
const cleanUserReqObj = (name, email, role, password) => {
    if (!name?.trim() || !email?.trim() || !role?.trim() || !password?.trim()) {
        throw new AppError("All fields are required", 400);
    }
    return {
        cleanedName: name.trim(),
        cleanedEmail: email.trim(),
        cleanedRole: role.trim().toLowerCase(),
        cleanedPassword: password.trim(),
    };
};
export default cleanUserReqObj;
//# sourceMappingURL=cleanUserReqObj.js.map