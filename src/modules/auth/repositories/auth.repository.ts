import prisma from "../../../config/database";
import type { User } from "@prisma/client";
import type { IAuthRepository } from "../interfaces/auth.repository.interface";

export class AuthRepository implements IAuthRepository {
  async createUser(
    data: Omit<User, "id" | "created_at" | "updated_at" | "isVerified">,
  ): Promise<User> {
    return prisma.user.create({ data });
  }
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }
}
