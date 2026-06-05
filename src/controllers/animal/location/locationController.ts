import { AnimalLocation } from "./type";
import animalLocation from "../../../repositories/animal/location/animalLocation";
class locationAnimal {
  locationGet(animalId: number) {
    return animalLocation.getAll(animalId);
  }
  locationGetId(id: number) {
    return animalLocation.getId(id);
  }
  locationCreate(location: AnimalLocation): Promise<unknown> {
    return animalLocation.create(location);
  }
  locationUpdate(locationUpdate:AnimalLocation, id:number){
    return animalLocation.update(locationUpdate,id)
  }
  locationDelete(id: number) {
    return animalLocation.delete(id);
  }
}

export default new locationAnimal();
