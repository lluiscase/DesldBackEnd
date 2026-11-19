import connection from "../../../database/database";
import notificationController from "../../../controllers/notification/notificationController";
import { petAdapter, PetResponse } from "../../../adapters/petAdapter";

export interface CreateAnimalAtomicInput {
  name?: string | null;
  species?: string;
  status?: "lost" | "street" | "rescued" | "adoption" | "adopted";
  gender?: "male" | "female";
  age?: number;
  size?: "small" | "medium" | "large";
  color?: string;
  description?: string;
  location?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  tags?: string[];
  characteristics?: string[];
  photos?: Array<{ url: string; brightness?: number }>;
  contactName?: string;
  contact_name?: string;
  contactPhone?: string;
  contact_phone?: string;
  missing_date?: string;
}

class AnimalMainModel {
  async getAll(
    filters: { status?: string; search?: string; tag?: string } = {},
    currentUserId: number | null = null,
    baseUrl?: string
  ): Promise<PetResponse[]> {
    return new Promise((resolve, reject) => {
      let sql = "SELECT * FROM animals WHERE 1=1";
      const params: any[] = [];

      if (filters.status) {
        sql += " AND status = ?";
        params.push(filters.status);
      }

      if (filters.search) {
        sql += " AND (name LIKE ? OR description LIKE ? OR species LIKE ?)";
        const term = `%${filters.search}%`;
        params.push(term, term, term);
      }

      sql += " ORDER BY created_at DESC";

      connection.query(sql, params, async (error: any, animalRows: any[]) => {
        if (error) {
          return reject(error);
        }

        if (!animalRows || animalRows.length === 0) {
          return resolve([]);
        }

        const animalIds = animalRows.map((a) => a.id);

        try {
          // Busca em lote todas as imagens e localizações dos animais listados
          const [images, locations] = await Promise.all([
            new Promise<any[]>((res, rej) => {
              connection.query(
                "SELECT * FROM animal_images WHERE animal_id IN (?) ORDER BY display_order ASC",
                [animalIds],
                (err: any, rows: any) => (err ? rej(err) : res(rows || []))
              );
            }),
            new Promise<any[]>((res, rej) => {
              connection.query(
                "SELECT * FROM animal_locations WHERE animal_id IN (?)",
                [animalIds],
                (err: any, rows: any) => (err ? rej(err) : res(rows || []))
              );
            })
          ]);

          const imagesByAnimalId = new Map<number, any[]>();
          for (const img of images) {
            if (!imagesByAnimalId.has(img.animal_id)) {
              imagesByAnimalId.set(img.animal_id, []);
            }
            imagesByAnimalId.get(img.animal_id)!.push(img);
          }

          const locationByAnimalId = new Map<number, any>();
          for (const loc of locations) {
            locationByAnimalId.set(loc.animal_id, loc);
          }

          const result: PetResponse[] = animalRows.map((animal) => {
            const petImages = imagesByAnimalId.get(animal.id) || [];
            const petLocation = locationByAnimalId.get(animal.id) || null;
            return petAdapter(animal, petImages, petLocation, currentUserId, baseUrl);
          });

          // Filtro por tag opcional se solicitado na query
          if (filters.tag) {
            const filtered = result.filter((pet) =>
              pet.tags.some((t) => t.toLowerCase() === filters.tag!.toLowerCase())
            );
            return resolve(filtered);
          }

          resolve(result);
        } catch (enrichError) {
          reject(enrichError);
        }
      });
    });
  }

  async getId(
    id: number,
    currentUserId: number | null = null,
    baseUrl?: string
  ): Promise<PetResponse | null> {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM animals WHERE id = ?";
      connection.query(sql, [id], async (error: any, results: any[]) => {
        if (error) {
          return reject(error);
        }
        if (!results || results.length === 0) {
          return resolve(null);
        }

        const animalRow = results[0];

        try {
          const [images, locations] = await Promise.all([
            new Promise<any[]>((res, rej) => {
              connection.query(
                "SELECT * FROM animal_images WHERE animal_id = ? ORDER BY display_order ASC",
                [id],
                (err: any, rows: any) => (err ? rej(err) : res(rows || []))
              );
            }),
            new Promise<any[]>((res, rej) => {
              connection.query(
                "SELECT * FROM animal_locations WHERE animal_id = ?",
                [id],
                (err: any, rows: any) => (err ? rej(err) : res(rows || []))
              );
            })
          ]);

          const location = locations[0] || null;
          resolve(petAdapter(animalRow, images, location, currentUserId, baseUrl));
        } catch (enrichError) {
          reject(enrichError);
        }
      });
    });
  }

  getRawById(id: number): Promise<any | null> {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM animals WHERE id = ?", [id], (err: any, rows: any[]) => {
        if (err) return reject(err);
        resolve(rows && rows.length > 0 ? rows[0] : null);
      });
    });
  }

  createAtomic(
    input: CreateAnimalAtomicInput,
    userId: number,
    baseUrl?: string
  ): Promise<PetResponse> {
    return new Promise((resolve, reject) => {
      const tagsJson = JSON.stringify(input.tags || []);
      const characteristicsJson = JSON.stringify(input.characteristics || []);

      const animalRecord = {
        user_id: userId,
        name: input.name ? input.name.trim() : null,
        species: input.species ? input.species.trim() : "Outro",
        status: input.status || "street",
        gender: input.gender || null,
        age: input.age || null,
        size: input.size || null,
        color: input.color || null,
        description: input.description ? input.description.trim() : null,
        contact_name: input.contactName || input.contact_name || null,
        contact_phone: input.contactPhone || input.contact_phone || null,
        tags: tagsJson,
        characteristics: characteristicsJson,
        missing_date: input.missing_date ? new Date(input.missing_date) : null
      };

      connection.query("INSERT INTO animals SET ?", animalRecord, async (error: any, results: any) => {
        if (error) {
          return reject(error);
        }

        const animalId = results.insertId;

        try {
          // 1. Inserir imagens
          if (input.photos && input.photos.length > 0) {
            for (let i = 0; i < input.photos.length; i++) {
              const photo = input.photos[i];
              await new Promise((resImg, rejImg) => {
                connection.query(
                  "INSERT INTO animal_images SET ?",
                  {
                    animal_id: animalId,
                    image_url: photo.url,
                    brightness: photo.brightness ?? 0,
                    display_order: i
                  },
                  (imgErr: any) => (imgErr ? rejImg(imgErr) : resImg(true))
                );
              });
            }
          }

          // 2. Inserir localização
          if (input.location || input.coordinates) {
            await new Promise((resLoc, rejLoc) => {
              connection.query(
                "INSERT INTO animal_locations SET ?",
                {
                  animal_id: animalId,
                  address_label: input.location ? input.location.trim() : null,
                  latitude: input.coordinates ? input.coordinates.latitude : null,
                  longitude: input.coordinates ? input.coordinates.longitude : null
                },
                (locErr: any) => (locErr ? rejLoc(locErr) : resLoc(true))
              );
            });
          }

          const createdPet = await this.getId(animalId, userId, baseUrl);
          resolve(createdPet!);
        } catch (innerError) {
          reject(innerError);
        }
      });
    });
  }

  async update(animalData: any, id: number, baseUrl?: string): Promise<PetResponse | null> {
    const oldAnimal = await this.getRawById(id);
    if (!oldAnimal) return null;

    const fieldsToUpdate: any = {};
    if (animalData.name !== undefined) fieldsToUpdate.name = animalData.name ? animalData.name.trim() : null;
    if (animalData.status) fieldsToUpdate.status = animalData.status;
    if (animalData.species) fieldsToUpdate.species = animalData.species;
    if (animalData.description !== undefined) fieldsToUpdate.description = animalData.description;
    if (animalData.contactName || animalData.contact_name) {
      fieldsToUpdate.contact_name = animalData.contactName || animalData.contact_name;
    }
    if (animalData.contactPhone || animalData.contact_phone) {
      fieldsToUpdate.contact_phone = animalData.contactPhone || animalData.contact_phone;
    }
    if (animalData.tags) fieldsToUpdate.tags = JSON.stringify(animalData.tags);
    if (animalData.characteristics) fieldsToUpdate.characteristics = JSON.stringify(animalData.characteristics);

    return new Promise((resolve, reject) => {
      connection.query(
        "UPDATE animals SET ? WHERE id = ?",
        [fieldsToUpdate, id],
        async (error: any) => {
          if (error) {
            return reject(error);
          }

          if (animalData.status && oldAnimal.status !== animalData.status) {
            await notificationController.animalCreate({
              animal_id: id,
              type: "status_changed",
              message: `O status de ${oldAnimal.name || "animal"} foi alterado para ${animalData.status}`
            });
          }

          const updated = await this.getId(id, oldAnimal.user_id, baseUrl);
          resolve(updated);
        }
      );
    });
  }

  delete(id: number): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      connection.query("DELETE FROM animals WHERE id = ?", [id], (error: any) => {
        if (error) {
          return reject(error);
        }
        resolve({ message: "Anúncio excluído com sucesso" });
      });
    });
  }
}

export default new AnimalMainModel();
