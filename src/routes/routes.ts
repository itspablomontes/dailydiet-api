import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import authRoutes from "../modules/auth/routes/auth.routes";

const setupRoutes = (app: Express) => {
  app.use(express.json());
  app.use(cors());
  app.get("/server-test", (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running!" });
  });

  app.use("/auth", authRoutes);
};

export { setupRoutes };
