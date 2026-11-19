import { Router, Request, Response } from "express";
import authController from "../controllers/auth/authController";
import { login } from "../controllers/auth/type";

const routerAuth = Router();

// POST /login
routerAuth.post("/login", async (req: Request, res: Response) => {
  try {
    const loginData: login = req.body;
    const result = await authController.login(loginData);
    return res.status(200).json(result);
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Erro na autenticação";
    const statusCode = message.includes("inválidos") ? 401 : 400;
    return res.status(statusCode).json({ message });
  }
});

// POST /forgot-password
routerAuth.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await authController.forgotPassword(email);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao processar solicitação"
    });
  }
});

export default routerAuth;
