import { image } from "../../../controllers/animal/image/type"; 
import connection from "../../../database/database";

class imageModel {
  getAll(id:number) {
    const sql = "SELECT * FROM animal_images WHERE animal_id = ?";
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

  create(images:image) {
    const sql = "INSERT INTO animal_images SET ?";
    return new Promise(async (resolve, reject) => {
      try {
        connection.query(sql,[images], (error: any, results: any) => {
          if (error) {
            console.log("imagem não cadastrou", error.message);
            reject(error);
            return;
          }
          console.log("imagem cadastrada");
          resolve(results);
        });
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
}

export default new imageModel();