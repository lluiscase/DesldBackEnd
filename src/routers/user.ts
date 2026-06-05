import { Router,Request,Response } from 'express';
import { CreateUser } from '../controllers/user/type';
import userController from '../controllers/user/userController';
const router = Router();

// GET ALL
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

// GET ID
router.get('/user/:id', async (req: Request, res: Response) => {
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

//PUT
router.put('/user/:id', async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const userUpdated = req.body
        const result = await userController.userUpdate(userUpdated,Number(id));

        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

//DELETE
router.delete('/user/:id',async(req:Request,res:Response)=>{
    try{
        const {id} = req.params
        const result = await userController.userDelete(Number(id))
        return res.status(200).json(result)
    }catch(error){
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        })
    }
})

export default router;