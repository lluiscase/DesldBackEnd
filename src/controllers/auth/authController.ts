import authModel, { AuthSuccessResponse } from "../../repositories/authModel";
import { login } from "./type";

class AuthController {
  login(loginData: login): Promise<AuthSuccessResponse> {
    return authModel.login(loginData);
  }

  forgotPassword(email: string): Promise<{ message: string }> {
    if (!email) {
      throw new Error("O e-mail é obrigatório para recuperação de senha");
    }
    return Promise.resolve({
      message: "Se o e-mail informado estiver cadastrado, um link de recuperação será enviado."
    });
  }
}

export default new AuthController();
