import {UserRepository} from "../../../entities/repositories/user_repository";
import {User} from "../../../entities/types/user";
import _ from 'lodash';
import fs from 'fs';
import Bluebird from 'bluebird';
import UserEntity from "../../entities";

export default class SequelizeUserRepository implements UserRepository {
  findByUuid(uuid: string): Promise<User|null> {
    return Promise.resolve(UserEntity.find({where: {uuid}}).then((userEntity) => {
      return userEntity && userEntity.toUser()
    }));
  }

  findByAccount(account: string): Promise<User|null> {
    return Promise.resolve(UserEntity.find({where: {account}}).then((userEntity) => {
      return userEntity && userEntity.toUser()
    }));
  }

  findById(id: number): Promise<User|null> {
    return Promise.resolve(UserEntity.find({where: {id}}).then((userEntity) => {
      return userEntity && userEntity.toUser()
    }));
  }

  async save(user: User): Promise<User> {
    return Promise.resolve(UserEntity.fromUser(user).save().then((entity) => entity.toUser()))
  }
}