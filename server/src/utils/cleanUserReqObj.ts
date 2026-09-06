import AppError from "./appError.js";

interface CleanUserReqObj {
  cleanedName: string;
  cleanedEmail: string;
  cleanedRole: string;
  cleanedPassword: string;
  
}

const cleanUserReqObj = (
  name: string,
  email: string,
   role: string,
  password: string,
 
): CleanUserReqObj => {

  if (!name?.trim() || !email?.trim()  || !role?.trim() || !password?.trim()) {
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
