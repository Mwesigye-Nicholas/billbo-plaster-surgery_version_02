declare global {
  namespace Express {
    interface Request {
        user?: UserPayload;
      files?: Multer.File[];
    }
    interface UserPayload {
      sub: string;
      role: "surgeon" | "nurse" | "doctor" | "admin";
      email: string;
      name: string;
    }
  }
}
export {}