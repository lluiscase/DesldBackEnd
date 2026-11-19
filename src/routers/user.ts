import { Router, Request, Response } from "express";
import userController from "../controllers/user/userController";
import { validateId, authMiddleware } from "./middleware";

const routerUser = Router();

// Handler de cadastro de usuário compartilhado entre /user e /register
async function handleUserCreate(req: Request, res: Response) {
  try {
    const newUser = req.body;
    const result = await userController.userCreate(newUser);
    return res.status(201).json(result);
  } catch (error: any) {
    const message = error instanceof Error ? error.message : "Erro ao cadastrar usuário";
    const statusCode = message.includes("cadastrado") ? 409 : 400;
    return res.status(statusCode).json({ message });
  }
}

// POST /register e POST /user (aliases)
routerUser.post("/register", handleUserCreate);
routerUser.post("/user", handleUserCreate);

// GET /user/me (usuário logado)
routerUser.get("/user/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const user = await userController.userGetId(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao obter usuário"
    });
  }
});

// GET /user (todos os usuários ativos)
routerUser.get("/user", async (_req: Request, res: Response) => {
  try {
    const result = await userController.usersGet();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao listar usuários"
    });
  }
});

// GET /user/:id
routerUser.get("/user/:id", validateId, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userController.userGetId(Number(id));

    if (!result) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao buscar usuário"
    });
  }
});

// PUT /user/:id
routerUser.put("/user/:id", validateId, authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const targetId = Number(id);

    // Permite que o usuário edite apenas o próprio perfil
    if (req.userId !== targetId) {
      return res.status(403).json({ message: "Você não tem permissão para alterar este perfil" });
    }

    const userUpdated = req.body;
    const result = await userController.userUpdate(userUpdated, targetId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao atualizar usuário"
    });
  }
});

// DELETE /user/:id
routerUser.delete("/user/:id", validateId, authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const targetId = Number(id);

    if (req.userId !== targetId) {
      return res.status(403).json({ message: "Você não tem permissão para remover este perfil" });
    }

    const result = await userController.userDelete(targetId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao deletar usuário"
    });
  }
});

export default routerUser;
