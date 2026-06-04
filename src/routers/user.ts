import { Router,Request,Response } from 'express';
import { CreateUser } from '../controllers/user/type';
import userController from '../controllers/user/userController';
const router = Router();

// GET
router.get('/user', async (req: Request, res: Response) => {
    try {
        const result = await userController.usersGet();

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// POST
router.post('/user', async (req: Request, res: Response) => {
    try {
        const newUser: CreateUser = req.body;

        const result = await userController.userCreate(newUser);

        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router;