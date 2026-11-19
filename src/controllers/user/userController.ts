import userModel, { CreateUserInput } from "../../repositories/userModel";
import { UserProfileResponse } from "../../adapters/userAdapter";

class UserController {
  usersGet(): Promise<UserProfileResponse[]> {
    return userModel.getAll();
  }

  userGetId(id: number): Promise<UserProfileResponse | null> {
    return userModel.getId(id);
  }

  userCreate(newUser: CreateUserInput): Promise<{ user: UserProfileResponse; token: string }> {
    return userModel.create(newUser);
  }

  userUpdate(userUpdated: Partial<CreateUserInput>, id: number): Promise<UserProfileResponse | null> {
    return userModel.update(userUpdated, id);
  }

  userDelete(id: number): Promise<{ message: string }> {
    return userModel.delete(id);
  }
}

export default new UserController();
