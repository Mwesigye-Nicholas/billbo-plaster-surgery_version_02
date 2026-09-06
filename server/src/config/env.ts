import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, "../../.env"),
})

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI!;
export const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY!;
export const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY!;
export const NODE_ENV = process.env.NODE_ENV || 'development';
