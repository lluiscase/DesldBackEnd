import { Router } from "express";
import authController from "../controllers/auth/authController";
import { login } from "../controllers/auth/type";

const routerLogin = Router();

//post
routerLogin.post("/login", async (req, res) => {
  try {
    const login:login = req.body;
    const result = await authController.login(login);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default routerLogin;