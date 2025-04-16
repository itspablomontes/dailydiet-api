import prisma from "../../../config/database";
import type { Session, User } from "@prisma/client";
import type { IAuthRepository } from "../interfaces/auth.repository.interface";

export class AuthRepository implements IAuthRepository {
  async createUser(
    data: Omit<User, "id" | "created_at" | "updated_at" | "isVerified">,
  ): Promise<User> {
    return prisma.user.create({ data });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }
  async findUserbyId(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async createSession(
    userId: number,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<Session> {
    return prisma.session.create({
      data: { userId, refreshToken, expires_at: expiresAt },
    });
  }

  async findSessionByRefreshToken(
    refreshToken: string,
  ): Promise<Session | null> {
    return prisma.session.findUnique({
      where: {
        refreshToken,
      },
    });
  }

  async deleteSession(refreshToken: string): Promise<void> {
    await prisma.session.delete({ where: { refreshToken } });
  }

  async deleteExpiredSessions(): Promise<void> {
    await prisma.session.deleteMany({
      where: { expires_at: { lte: new Date() } },
    });
  }
}
