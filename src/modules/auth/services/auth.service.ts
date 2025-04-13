import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import type { IAuthRepository } from "../interfaces/auth.repository.interface";

export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ token: string; user: Partial<User> }> {
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.authRepository.createUser({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return {
      token,
      user,
    };
  }
}
