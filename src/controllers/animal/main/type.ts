import { image } from "../image/type";
import { AnimalLocation } from "../location/type";
export type animal ={
    id:number;
    user_id:number;
    name:string;
    species:string;
    status:'missing'|'found'|'reunited';
    gender:'male'|'female';
    age:number;
    size:'small'|'medium'|'large';
    color:string;
    description:string;
    missing_date:string
    images: image[]
    location:AnimalLocation[]
}