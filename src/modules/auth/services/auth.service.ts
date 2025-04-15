import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import type { IAuthRepository } from "../interfaces/auth.repository.interface";

export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  private generateToken(userId: number): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
  }

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
  }): Promise<{ token: string; user: Partial<User> }> {
    const existingUser = await this.authRepository.findByEmail(data.email);

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
    return {
      token,
      user: {
        email: existingUser.email,
        name: existingUser.name,
      },
    };
  }
}
