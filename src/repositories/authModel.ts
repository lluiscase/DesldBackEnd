import { login } from "../controllers/auth/type";
import connection from "../database/database";
import userModel from "./userModel";
import bcrypt from "bcrypt";


class AuthModel{
    async login(login: login) {
    const user:any = await userModel.getByEmail(login.email)
    if(!user)throw new Error("Usuário não encontrado")
    const match = await bcrypt.compare(login.password, user.password)
    if(!match)throw new Error("Senha Inválida")
    console.log("Usuário logado")
    return user
  }
}

export default new AuthModel() 