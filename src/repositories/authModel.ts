import { login } from "../controllers/auth/type";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userAdapter, UserProfileResponse } from "../adapters/userAdapter";

const JWT_SECRET = process.env.JWT_SECRET || 'auhelp_super_secret_jwt_key_2026';

export interface AuthSuccessResponse {
  user: UserProfileResponse;
  token: string;
}

class AuthModel {
  async login(credentials: login): Promise<AuthSuccessResponse> {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email e senha são obrigatórios");
    }

    const user: any = await userModel.getByEmail(credentials.email);
    if (!user) {
      throw new Error("Email ou senha inválidos");
    }

    const match = await bcrypt.compare(credentials.password, user.password);
    if (!match) {
      throw new Error("Email ou senha inválidos");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      user: userAdapter(user),
      token
    };
  }
}

export default new AuthModel();
