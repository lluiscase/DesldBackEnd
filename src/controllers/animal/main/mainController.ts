import { animal} from "./type"
import animalMainModel from "../../../repositories/animal/main/animalMainModel" 
class AnimalController{
    animalGet(){
        return animalMainModel.getAll()
    }
    animalGetId(id:number){
        return animalMainModel.getId(id)
    }
    animalCreate(animals:animal): Promise<unknown>{
        return animalMainModel.create(animals)
    }
    animalUpdate(animalUpdated:animal,id:number){
        return animalMainModel.update(animalUpdated,id)
    }
    animalDelete(id:number){
        return animalMainModel.delete(id)
    }
}

export default new AnimalController();