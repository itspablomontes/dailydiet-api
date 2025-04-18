import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import {
  loginSchema,
  refreshSchema,
  registerSchema,
} from "../schemas/auth.schema";
import { ZodError } from "zod";
import { AuthRepository } from "../repositories/auth.repository";

class AuthController {
  constructor(private authService: AuthService) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const input = registerSchema.parse(req.body);
      const result = await this.authService.register(input);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.errors });
        return;
      }
      if (error instanceof Error) {
        res.status(409).json({ error: error.message });
        return;
      }
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const input = loginSchema.parse(req.body);
      const result = await this.authService.login(input);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.errors });
        return;
      }
      if (error instanceof Error) {
        res.status(409).json({ error: error.message });
        return;
      }
      next(error);
    }
  };

  refresh = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { refreshToken } = refreshSchema.parse(req.body);
      const result = await this.authService.refresh(refreshToken);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.errors });
        return;
      }
      if (error instanceof Error) {
        res.status(201).json({ error: error.message });
        return;
      }
      next(error);
    }
  };
  logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { refreshToken } = refreshSchema.parse(req.body);
      await this.authService.logout(refreshToken, req.user?.id!);
      res.status(200).json({ message: "Logout was successful" });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.errors });
        return;
      }
      if (error instanceof Error) {
        res.status(200).json({ error: error.message });
        return;
      }
      next(error);
    }
  };
}

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

const authController = new AuthController(authService);

export { authController };
