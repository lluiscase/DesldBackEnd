import { Router, Request, Response } from "express";
import aiController from "../controllers/ai/aiController";

const routerAi = Router();

// POST /ai/triage
routerAi.post("/ai/triage", async (req: Request, res: Response) => {
  try {
    const { image } = req.body;
    const result = await aiController.triage(image);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao processar triagem por IA"
    });
  }
});

export default routerAi;
