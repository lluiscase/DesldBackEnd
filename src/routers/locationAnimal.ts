import locationController from '../controllers/animal/location/locationController';
import { Router,Request,Response } from 'express';
import { validateId } from './middleware';
const routerLocation = Router();

//POST LOCATION
routerLocation.post('/location-animal', async (req: Request, res: Response) => {
    try {
        const newLocation = req.body;
        const result = await locationController.locationCreate(newLocation);

        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

//GET ALL
routerLocation.get('/location-animal/:id', validateId, async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const result = await locationController.locationGet(Number(id));
        if(!result){
            return res.status(404).json({
                message:"Local not found"
            })
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// GET ID
routerLocation.get('/location-animal/:id',validateId, async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const result = await locationController.locationGetId(id);

        if(!result){
            return res.status(404).json({
                message:"Local not found"
            })
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

//PUT
routerLocation.put('/location-animal/:id', async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const locationUpdated = req.body
        const result = await locationController.locationUpdate(locationUpdated,Number(id));

        return res.status(201).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

//DELETE
routerLocation.delete('/location-animal/:id',async(req:Request,res:Response)=>{
    try{
        const {id} = req.params
        const result = await locationController.locationDelete(Number(id))
        return res.status(200).json(result)
    }catch(error){
        return res.status(400).json({
            message: error instanceof Error ? error.message : 'Unknown error'
        })
    }
})

export default routerLocation;