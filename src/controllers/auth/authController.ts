import authModel from "../../repositories/authModel";
import { login } from "./type";

class AuthController {
  login(login:login) {
    return authModel.login(login)
  }
}
export default new AuthController();
