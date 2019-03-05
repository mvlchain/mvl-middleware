import {User} from "../types/user";

export interface UserRepository {
  findByUuid(uuid: string): Promise<User|null|undefined>;
  findByAccount(account: string): Promise<User|null|undefined>;
  save(user: User): Promise<User>;
}