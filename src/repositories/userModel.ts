import { CreateUser } from "../controllers/user/type";
import connection from "../database/database";

class UserModel {
  getAll() {
    const sql = "SELECT * FROM users";
    return new Promise((resolve, reject) => {
      connection.query(sql, {}, ({ error, response }: any) => {
        if (error) {
          console.log("Não listou usuarios");
          reject(error);
        }
        console.log("Listagem de usuarios");
        resolve(response);
      });
    });
  }

  create(user: CreateUser) {
    const sql = "INSERT INTO users SET ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, user, ({ error, response }: any) => {
        if (error) {
          console.log("Usuario não cadastrou");
          reject(error);
        }
        console.log("Usuario criado");
        resolve(response);
      });
    });
  }
}

export default new UserModel()
