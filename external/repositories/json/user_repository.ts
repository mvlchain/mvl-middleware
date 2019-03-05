import {UserRepository} from "../../../entities/repositories/user_repository";
import {User} from "../../../entities/types/user";
import _ from 'lodash';
import fs from 'fs';
import Bluebird from 'bluebird';

export default class JSONUserRepository implements UserRepository {
  private users: User[] = [];
  private jsonPath: string;

  constructor({userJsonPath}: {userJsonPath: string}) {
    this.jsonPath = userJsonPath;
    try {
      fs.statSync(userJsonPath);
    } catch (e) {
      fs.writeFileSync(userJsonPath, "[]");
    }
    this.users = JSON.parse(fs.readFileSync(userJsonPath).toString());
  }

  findByUuid(uuid: string): Promise<User|null|undefined> {
    return Promise.resolve(_.find(this.users, (user) => uuid === user.uuid));
  }

  findByAccount(account: string): Promise<User|null|undefined> {
    return Promise.resolve(_.find(this.users, (user) => account === user.account));
  }

  async save(user: User): Promise<User> {
    const index = _.findIndex(this.users, (user2) => user.uuid === user2.uuid);
    if (index >= 0) {
      this.users[index] = _.cloneDeep(user);
    } else {
      // insert
      this.users.push(_.cloneDeep(user));
    }
    await Bluebird.fromCallback(cb => fs.writeFile(this.jsonPath, JSON.stringify(this.users), cb));
    return user;
  }
}