import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET_KEY } from "../config/env.js";
const accessTokenGenerator = (payload) => {
    return jwt.sign({ ...payload }, ACCESS_TOKEN_SECRET_KEY, { expiresIn: "45m" });
};
export default accessTokenGenerator;
//# sourceMappingURL=accessTokenGenerator.js.map