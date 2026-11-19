import { Router, Request, Response } from "express";
import petshopController from "../controllers/petshop/petshopController";

const routerPetshop = Router();

// GET /petshops
routerPetshop.get("/petshops", async (_req: Request, res: Response) => {
  try {
    const result = await petshopController.petshopGet();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao listar petshops"
    });
  }
});

// GET /petshops/:id
routerPetshop.get("/petshops/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const result = await petshopController.petshopGetId(id);

    if (!result) {
      return res.status(404).json({ message: "Petshop não encontrado" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao buscar petshop"
    });
  }
});

export default routerPetshop;
