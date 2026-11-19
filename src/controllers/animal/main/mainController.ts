import animalMainModel, { CreateAnimalAtomicInput } from "../../../repositories/animal/main/animalMainModel";
import { PetResponse } from "../../../adapters/petAdapter";

export class ForbiddenError extends Error {
  statusCode = 403;
  constructor(message: string = "Você não tem permissão para alterar este anúncio") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  constructor(message: string = "Animal não encontrado") {
    super(message);
    this.name = "NotFoundError";
  }
}

class MainController {
  animalGet(
    filters: { status?: string; search?: string; tag?: string } = {},
    currentUserId: number | null = null,
    baseUrl?: string
  ): Promise<PetResponse[]> {
    return animalMainModel.getAll(filters, currentUserId, baseUrl);
  }

  animalGetId(
    id: number,
    currentUserId: number | null = null,
    baseUrl?: string
  ): Promise<PetResponse | null> {
    return animalMainModel.getId(id, currentUserId, baseUrl);
  }

  animalCreate(
    newAnimal: CreateAnimalAtomicInput,
    userId: number,
    baseUrl?: string
  ): Promise<PetResponse> {
    if (!userId) {
      throw new Error("Usuário autenticado não identificado para criar o anúncio");
    }
    return animalMainModel.createAtomic(newAnimal, userId, baseUrl);
  }

  async animalUpdate(
    animalUpdated: any,
    id: number,
    userId: number,
    baseUrl?: string
  ): Promise<PetResponse | null> {
    const existing = await animalMainModel.getRawById(id);
    if (!existing) {
      throw new NotFoundError();
    }

    if (Number(existing.user_id) !== Number(userId)) {
      throw new ForbiddenError();
    }

    return animalMainModel.update(animalUpdated, id, baseUrl);
  }

  async animalDelete(id: number, userId: number): Promise<{ message: string }> {
    const existing = await animalMainModel.getRawById(id);
    if (!existing) {
      throw new NotFoundError();
    }

    if (Number(existing.user_id) !== Number(userId)) {
      throw new ForbiddenError();
    }

    return animalMainModel.delete(id);
  }
}

export default new MainController();
