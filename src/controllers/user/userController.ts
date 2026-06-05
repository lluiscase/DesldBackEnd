import { CreateUser} from "./type"
import userModel from '../../repositories/userModel';
class UserController{
    usersGet(){
        return userModel.getAll()
    }
    userGetId(id:number){
        return userModel.getId(id)
    }
    userGetEmail(email:string){
        return userModel.getByEmail(email)
    }
    userCreate(newUser:CreateUser): Promise<unknown>{
        return userModel.create(newUser)
    }
    userUpdate(userUpdated:CreateUser,id:number){
        return userModel.update(userUpdated,id)
    }
    userDelete(id:number){
        return userModel.delete(id)
    }
}

export default new UserController