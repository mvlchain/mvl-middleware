import {UserRepository} from "../../../entities/repositories/user_repository";
import {User} from "../../../entities/types/user";
import _ from 'lodash';

export default class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  findByUuid(uuid: string): Promise<User|undefined> {
    return Promise.resolve(_.find(this.users, (user) => uuid === user.uuid));
  }

  findByAccount(account: string): Promise<User|undefined> {
    return Promise.resolve(_.find(this.users, (user) => account === user.account));
  }

  save(user: User): Promise<User> {
    // update
    const index = _.findIndex(this.users, (user2) => user.uuid === user2.uuid);
    if (index >= 0) {
      this.users[index] = _.cloneDeep(user);
      return Promise.resolve(user);
    } else {
      // insert
      this.users.push(_.cloneDeep(user));
      return Promise.resolve(user);
    }
  }
}