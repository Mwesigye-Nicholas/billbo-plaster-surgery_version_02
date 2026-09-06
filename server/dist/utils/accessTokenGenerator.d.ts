interface TokenPayload {
    sub: string;
    name: string;
    email: string;
    role: "surgeon" | "admin" | "assistant";
}
declare const accessTokenGenerator: (payload: TokenPayload) => string;
export default accessTokenGenerator;
//# sourceMappingURL=accessTokenGenerator.d.ts.map