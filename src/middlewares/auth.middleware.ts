import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface jwtPayload {
  id: number;
  role: "USER" | "ADMIN";
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    res.status(401).json({ error: "Access Token Required" });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({ error: "Server configuration Error" });
    return;
  }

  try {
    const decoded = jwt.verify(accessToken, jwtSecret) as jwtPayload;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid Access Token" });
    return;
  }
};
