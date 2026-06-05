import { image} from "./type"
import animalImage from "../../../repositories/animal/image/animalImage"
class ImageController{
    imageGet(id:number){
        return animalImage.getAll(id)
    }
    imageCreate(imagem:image): Promise<unknown>{
        return animalImage.create(imagem)
    }
}

export default new ImageController();