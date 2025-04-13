import type { User } from "@prisma/client";

export interface IAuthRepository {
  createUser(
    data: Omit<User, "id" | "created_at" | "updated_at" | "isVerified">,
  ): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
