import { Notification } from "../../controllers/notification/type";
import connection from "../../database/database";

class notificationModel {
  getid(id:number) {
    const sql = "SELECT * FROM notification WHERE id = ?";
    return new Promise((resolve, reject) => {
      connection.query(sql,[id], (error: any, results: any) => {
        if (error) {
          console.log("Não listou as imagem do animal", error.message);
          reject(error);
          return;
        }
        console.log("Listagem das imagens do animal");
        resolve(results);
      });
    });
  }

  create(notification:Notification) {
    const sql = "INSERT INTO notification SET ?";
    return new Promise(async (resolve, reject) => {
      try {
        connection.query(sql,[notification], (error: any, results: any) => {
          if (error) {
            console.log("Não criou a notificação", error.message);
            reject(error);
            return;
          }
          console.log("Notificação Criada Atualização feita");
          resolve(results);
        });
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
}

export default new notificationModel();