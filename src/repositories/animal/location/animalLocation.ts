import { AnimalLocation } from "../../../controllers/animal/location/type";
import connection from "../../../database/database";

class locationAnimalModel {
  getAll(id: number) {
    const sql = "SELECT * FROM animal_locations WHERE animal_id = ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [id], (error: any, results: any) => {
        if (error) {
          console.log("Não listou localização", error.message);
          reject(error);
          return;
        }
        console.log("Listagem de usuarios");
        resolve(results);
      });
    });
  }

  getId(id: number) {
    const sql = "SELECT * FROM animal_locations WHERE id = ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [id], (error: any, results: any) => {
        if (error) {
          console.log("Não listou a localização", error.message);
          reject(error);
          return;
        }
        console.log("Listagem de localizações");
        resolve(results[0] || null);
      });
    });
  }

  create(location: AnimalLocation) {
    const sql = "INSERT INTO animal_locations SET ?";
    return new Promise(async (resolve, reject) => {
      try {
        connection.query(sql, location, (error: any, results: any) => {
          if (error) {
            console.log("Localização não cadastrou", error.message);
            reject(error);
            return;
          }
          console.log("Localização criado");
          resolve(results);
        });
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  update(locationUpdated: AnimalLocation, id: number) {
    const sql = "UPDATE animal_locations SET ? WHERE id= ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [locationUpdated, id], (error: any, results: any) => {
        if (error) {
          console.log("Localização não atualizou", error.message);
          reject(error);
          return;
        }
        console.log("Localização atualizou");
        resolve(results);
      });
    });
  }

  delete(id: number) {
    const sql = "DELETE FROM animal_locations WHERE id= ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, id, (error: any, results: any) => {
        if (error) {
          console.log("Localização não foi deletada", error.message);
          reject(error);
          return;
        }
        console.log("Localização deletado");
        resolve(results);
      });
    });
  }
}

export default new locationAnimalModel();
