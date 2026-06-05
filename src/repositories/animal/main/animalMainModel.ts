import { animal } from "../../../controllers/animal/main/type";
import connection from "../../../database/database";
class animalModel {
  getAll() {
    const sql = "SELECT * FROM animals";
    return new Promise((resolve, reject) => {
      connection.query(sql, (error: any, results: any) => {
        if (error) {
          console.log("Não listou animais", error.message);
          reject(error);
          return;
        }
        console.log("Listagem de animais");
        resolve(results);
      });
    });
  }

  getId(id: number) {
    const sql =
      "SELECT a.*, ai.id AS image_id, ai.image_url, al.id AS location_id, al.zip, al.state, al.city, al.county, al.latitude, al.longitude, al.observation_date FROM animals a LEFT JOIN animal_images ai  ON ai.animal_id = a.id LEFT JOIN animal_locations al  ON al.animal_id = a.id WHERE a.id = ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [id], (error: any, results: any) => {
        if (error) {
          console.log("Não listou o animal", error.message);
          reject(error);
          return;
        }
        if (results.length === 0) {
          resolve(null);
          return;
        }

        const animal: animal = {
          id: results[0].id,
          user_id: results[0].user_id,
          name: results[0].name,
          species: results[0].species,
          status: results[0].status,
          gender: results[0].gender,
          age: results[0].age,
          size: results[0].size,
          color: results[0].color,
          description: results[0].description,
          missing_date: results[0].missing_date,
          images: [],
          location: [],
        };

        for (const row of results) {
          if (row.image_id) {
            animal.images.push({
              id: row.image_id,
              animal_id: results[0].id,
              image_url: row.image_url,
            });
          }
          if (row.location_id) {
            animal.location.push({
              id: row.location_id,
              animal_id: results[0].id,
              zip: row.zip,
              state: row.state,
              city: row.city,
              county: row.county,
              latitude: row.latitude,
              longitude: row.longitude,
              observation_date: row.observation_date,
            });
          }
        }
        console.log("Listagem de animal");
        resolve(animal);
      });
    });
  }

  create(animals: animal) {
    const sql = "INSERT INTO animals SET ?";
    return new Promise(async (resolve, reject) => {
      try {
        connection.query(sql, [animals], (error: any, results: any) => {
          if (error) {
            console.log("animal não cadastrou", error.message);
            reject(error);
            return;
          }
          console.log("animal criado");
          resolve(results);
        });
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
  update(animal: animal, id: number) {
    const sql = "UPDATE animals SET ? WHERE id= ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [animal, id], (error: any, results: any) => {
        if (error) {
          console.log("animal não atualizou", error.message);
          reject(error);
          return;
        }
        console.log("animal atualizou");
        resolve(results);
      });
    });
  }

  delete(id: number) {
    const sql = "DELETE FROM animals WHERE id= ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, id, (error: any, results: any) => {
        if (error) {
          console.log("animal não foi deletado", error.message);
          reject(error);
          return;
        }
        console.log("animal deletado");
        resolve(results);
      });
    });
  }
}

export default new animalModel();
