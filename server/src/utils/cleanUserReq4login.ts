import  AppError  from "./appError.js";
interface CleanUserReqObj {
  cleanedEmail: string;
  cleanedPassword: string;
}
const cleanUserReq4login = (
  email: string,
  password: string
): CleanUserReqObj => {
  if (!email?.trim() || !password?.trim()) {
    throw new AppError("All fields are required", 400);
  }
  const cleanedEmail = email.trim().toLowerCase();
  const cleanedPassword = password.trim();
  return { cleanedEmail, cleanedPassword };
};
export default cleanUserReq4login;