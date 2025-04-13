import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { registerSchema } from "../schemas/auth.schema";
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
      } else if (
        error instanceof Error &&
        error.message === "Email already in use"
      ) {
        res.status(409).json({ error: error.message });
      } else {
        next(error);
      }
    }
  };
}

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

const authController = new AuthController(authService);

export { authController };
