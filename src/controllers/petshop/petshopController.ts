import petshopModel, { PetShopItem } from "../../repositories/petshopModel";

class PetshopController {
  petshopGet(): Promise<PetShopItem[]> {
    return petshopModel.getAll();
  }

  petshopGetId(id: string): Promise<PetShopItem | null> {
    return petshopModel.getId(id);
  }
}

export default new PetshopController();
