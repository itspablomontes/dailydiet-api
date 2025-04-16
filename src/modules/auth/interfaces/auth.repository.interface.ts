import type { Session, User } from "@prisma/client";

export interface IAuthRepository {
  createUser(
    data: Omit<User, "id" | "created_at" | "updated_at" | "isVerified">,
  ): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserbyId(id: number): Promise<User | null>;
  createSession(
    userId: number,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<Session>;
  findSessionByRefreshToken(refreshToken: string): Promise<Session | null>;
  deleteSession(refreshToken: string): Promise<void>;
  deleteExpiredSessions(): Promise<void>;
}
