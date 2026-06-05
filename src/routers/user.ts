import { Router,Request,Response } from 'express';
import { CreateUser } from '../controllers/user/type';
import userController from '../controllers/user/userController';
import { validateId } from './middleware';
const routerUser = Router();

// GET ALL
routerUser.get('/user', async (req: Request, res: Response) => {
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
routerUser.get('/user/:id',validateId, async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const result = await userController.userGetId(Number(id));

        if(!result){
            return res.status(404).json({
                message:"User not found"
            })
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// POST
routerUser.post('/user', async (req: Request, res: Response) => {
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
routerUser.put('/user/:id', async (req: Request, res: Response) => {
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
routerUser.delete('/user/:id',async(req:Request,res:Response)=>{
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

export default routerUser;