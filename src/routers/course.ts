import { Router, Request, Response } from "express";
import courseController from "../controllers/course/courseController";

const routerCourse = Router();

// GET /courses
routerCourse.get("/courses", async (_req: Request, res: Response) => {
  try {
    const result = await courseController.courseGet();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao listar cursos"
    });
  }
});

export default routerCourse;
