import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface jwtPayload {
  id: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Token Required" });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({ error: "Server configuration Error" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as jwtPayload;
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};
