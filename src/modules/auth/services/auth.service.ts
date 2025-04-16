import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import type { IAuthRepository } from "../interfaces/auth.repository.interface";
import { randomUUID } from "node:crypto";

export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  private generateToken(userId: number): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ token: string; user: Partial<User> }> {
    const existingUser = await this.authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.authRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(data: {
    email: string;
    password: string;
  }): Promise<{ token: string; refreshToken: string; user: Partial<User> }> {
    const existingUser = await this.authRepository.findUserByEmail(data.email);

    if (!existingUser) {
      throw new Error("This account doesn't exist");
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new Error("Invalid Password");
    }

    const token = this.generateToken(existingUser.id);

    const refreshToken = randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await this.authRepository.createSession(
      existingUser.id,
      refreshToken,
      expiresAt,
    );

    return {
      token,
      refreshToken,
      user: {
        email: existingUser.email,
        name: existingUser.name,
      },
    };
  }

  async refresh(refreshToken: string) {
    const session =
      await this.authRepository.findSessionByRefreshToken(refreshToken);

    if (!session || session.expires_at < new Date()) {
      throw new Error("Invalid or expired session");
    }

    const user = await this.authRepository.findUserbyId(session.userId);

    if (!user) {
      throw new Error("User not found!");
    }

    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user?.id,
      },
    };
  }

  async logout(refreshToken: string, userId: number) {
    const session =
      await this.authRepository.findSessionByRefreshToken(refreshToken);
    if (!session || session.userId !== userId) {
      throw new Error("Invalid Session");
    }

    await this.authRepository.deleteSession(refreshToken);
  }

  async cleanupSessions(): Promise<void> {
    await this.authRepository.deleteExpiredSessions();
  }
}
