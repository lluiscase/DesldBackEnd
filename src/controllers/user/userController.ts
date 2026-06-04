import { CreateUser, User } from "./type"
import userModel from '../../repositories/userModel';
class UserController{
    usersGet(){
        return userModel.getAll()
    }
    userCreate(newUser:CreateUser): Promise<unknown>{
        return userModel.create(newUser)
    }
    userUpdate(id:number){

    }
    userDelete(id:number){

    }
}

export default new UserController