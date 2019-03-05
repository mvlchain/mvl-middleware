import UsersController from "./controllers/users_controller";
import {Router} from "express";
import IssueMVPUserUsecase from "../usecases/issue_mvp_to_user_usecase";
import {Request} from "../app";
import {NextFunction, RequestHandlerParams, Response} from 'express-serve-static-core';

export default function (
  router: Router,
  usersController: UsersController,
) {
  console.log(router);
  console.log(usersController);
  router.get('/', ((req, res) => res.send("hello world")));
  router.post('/users', usersController.create);

  router.get("/test", async (req: Request, res: Response, next: NextFunction) => {
    res.send({ok: true});
  });

  router.post("/api/v1/tada/mvp/issue", async (req: Request, res: Response, next: NextFunction) => {
    const usecase: IssueMVPUserUsecase = req.container.resolve('issueMvpToUserUsecase');
    const uuid = req.body.uuid.trim();
    const point = req.body.point;

    if (!uuid) {
      throw new Error('email is required');
    }

    if (isNaN(+point)) {
      throw new Error('point needs to be a number');
    }

    await usecase.execute(uuid, point);

    res.send({ok: true});
  });
}