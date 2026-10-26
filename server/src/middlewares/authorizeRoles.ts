import type { Request, Response, NextFunction } from "express";

type UserRoles = "surgeon" | "nurse" | "doctor" | "admin";

const authorizeRoles = (...allowedRoles: UserRoles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}. Your role: ${req.user.role}`,
      });
    }
    next();
  };
};
export default authorizeRoles;
