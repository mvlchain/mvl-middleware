import {UserRepository} from "../entities/repositories/user_repository";
import {User} from "../entities/types/user";
export default class GetUserUsecase {
  private userRepository: UserRepository;

  constructor({
    userRepository,
  }: {
    userRepository: UserRepository,
  }) {
    this.userRepository = userRepository;
  }

  async execute(uuid: string): Promise<User|undefined|null> {
    const user = await this.userRepository.findByUuid(uuid);
    if (!user) {
      return null;
    }

    return user;
  }
}

