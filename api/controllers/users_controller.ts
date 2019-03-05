import CreateNewUserUseCase from "../../usecases/create_new_user_usecase";
import {Request} from "../../app";
import {Response} from "express";

export default class UsersController {
  async create(req: Request, res: Response) {
    const uuid = req.body.uuid.trim();
    const usecase: CreateNewUserUseCase = req.container.resolve('createNewUserUsecase');
    const user = await usecase.execute(uuid);
    console.log({uuid});
    console.log(user);
    res.send(user);
  }
}