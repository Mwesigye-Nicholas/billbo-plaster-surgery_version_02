interface CleanUserReqObj {
    cleanedName: string;
    cleanedEmail: string;
    cleanedRole: string;
    cleanedPassword: string;
}
declare const cleanUserReqObj: (name: string, email: string, role: string, password: string) => CleanUserReqObj;
export default cleanUserReqObj;
//# sourceMappingURL=cleanUserReqObj.d.ts.map