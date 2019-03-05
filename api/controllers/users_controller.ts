import GetUserUsecase from "../../usecases/get_user_usecase";
import CreateNewUserUseCase from "../../usecases/create_new_user_usecase";
import {Request} from "../../app";
import {Response} from "express";

export default class UsersController {
  async create(req: Request, res: Response) {
    const uuid = req.body.uuid.trim();
    const usecase: CreateNewUserUseCase = req.container.resolve('createNewUserUsecase');
    const user = await usecase.execute(uuid);
    //console.log({uuid});
    //console.log(user);
    res.send(user);
  }

  async get(req: Request, res: Response) {
    const uuid = req.params.uuid.trim();
    const usecase: GetUserUsecase = req.container.resolve('getUserUsecase');
    const user = await usecase.execute(uuid);
    if (user) {
      res.send({ok: true, user: {uuid: user.uuid, public_key: user.publicKey, account: user.account}});
    } else {
      res.send({ok: true, user: null});
    }
  }
}
