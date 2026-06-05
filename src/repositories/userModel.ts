import { CreateUser } from "../controllers/user/type";
import connection from "../database/database";

class UserModel {
  getAll() {
    const sql = "SELECT * FROM users";
    return new Promise((resolve, reject) => {
      connection.query(sql, (error: any, results: any) => {
        if (error) {
          console.log("Não listou usuarios", error.message);
          reject(error);
          return;
        }
        console.log("Listagem de usuarios");
        resolve(results);
      });
    });
  }

  getId(id:number) {
    const sql = "SELECT * FROM users WHERE id= ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, id, (error: any, results: any) => {
        if (error) {
          console.log("Não listou o usuario", error.message);
          reject(error);
          return;
        }
        console.log("Listagem de usuario");
        resolve(results);
      });
    });
  }

  create(user: CreateUser) {
    const sql = "INSERT INTO users SET ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, user, (error: any, results: any) => {
        if (error) {
          console.log("Usuario não cadastrou", error.message);
          reject(error);
          return;
        }
        console.log("Usuario criado");
        resolve(results);
      });
    });
  }
  update(userUpdated: CreateUser, id:number) {
    const sql = "UPDATE users SET ? WHERE id= ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [userUpdated, id], (error: any, results: any) => {
        if (error) {
          console.log("Usuario não atualizou", error.message);
          reject(error);
          return;
        }
        console.log("Usuario atualizou");
        resolve(results);
      });
    });
  }

  delete(id:number) {
    const sql = "DELETE FROM users WHERE id= ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, id, (error: any, results: any) => {
        if (error) {
          console.log("Usuario não foi deletado", error.message);
          reject(error);
          return;
        }
        console.log("Usuario deletado");
        resolve(results);
      });
    });
  }
}

export default new UserModel()
