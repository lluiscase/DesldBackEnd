import { Router } from "express";
import notificationController from "../controllers/notification/notificationController"; 

const routerLogin = Router();

//post
routerLogin.get("/notification/:id", async (req, res) => {
  try {
    const id = req.params.id
    const result = await notificationController.animalGetId(Number(id));
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default routerLogin;