import { Router,Request,Response } from 'express';
import mainController from '../controllers/animal/main/mainController';
import { upload, validateId } from './middleware';
import imageController from '../controllers/animal/image/imageController';
const routerAnimal = Router();

// GET ALL
routerAnimal.get('/animal', async (req: Request, res: Response) => {
    try {
        const result = await mainController.animalGet();

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// GET ID
routerAnimal.get('/animal/:id',validateId, async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const result = await mainController.animalGetId(id);

        if(!result){
            return res.status(404).json({
                message:"Animal not found"
            })
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

//GET IMAGE
routerAnimal.get('/image-animal/:id',validateId,async(req:Request,res:Response)=>{
    try{
        const id = Number(req.params.id)
        const result = await imageController.imageGet(id)

        if(!result)return res.status(404).json({
            message:"Not found images"
        })
        return res.status(200).json(result);
    }catch(error){
         return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
})

// POST
routerAnimal.post('/animal', async (req: Request, res: Response) => {
    try {
        const newAnimal = req.body;

        const result = await mainController.animalCreate(newAnimal);

        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});


//POST IMAGE
routerAnimal.post('/image-animal', upload.single('image'),async(req,res)=>{
     try {
        const file = req.file
        if (!file) {
            return res.status(400).json({
                message: "Image is required"
            });
        }
        const imageUrl = file ? `http://localhost:4000/${file.filename}`:null
        const newImage = {
            id:Number(req.params.id),
            animal_id: Number(req.body.animal_id),
            image_url:imageUrl
        }

        const result = await imageController.imageCreate(newImage);

        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
})

//PUT
routerAnimal.put('/animal/:id', async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const animalUpdated = req.body
        const result = await mainController.animalUpdate(animalUpdated,Number(id));

        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

//DELETE
routerAnimal.delete('/animal/:id',async(req:Request,res:Response)=>{
    try{
        const {id} = req.params
        const result = await mainController.animalDelete(Number(id))
        return res.status(200).json(result)
    }catch(error){
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        })
    }
})

export default routerAnimal;