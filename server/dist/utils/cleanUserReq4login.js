import AppError from "./appError.js";
const cleanUserReq4login = (email, password) => {
    if (!email?.trim() || !password?.trim()) {
        throw new AppError("All fields are required", 400);
    }
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedPassword = password.trim();
    return { cleanedEmail, cleanedPassword };
};
export default cleanUserReq4login;
//# sourceMappingURL=cleanUserReq4login.js.map