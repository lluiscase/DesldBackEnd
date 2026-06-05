export type Notification ={
    id?:number;
    animal_id:number;
    type:'location_added'|'status_changed';
    message:string;
}