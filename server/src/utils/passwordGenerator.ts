import bcrypt from "bcryptjs";

const passwordGenerator = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export default passwordGenerator;
