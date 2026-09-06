import bcrypt from "bcryptjs";
const passwordGenerator = async (password) => {
    return await bcrypt.hash(password, 10);
};
export default passwordGenerator;
//# sourceMappingURL=passwordGenerator.js.map