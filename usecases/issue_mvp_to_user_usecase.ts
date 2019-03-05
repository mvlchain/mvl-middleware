import {UserRepository} from "../entities/repositories/user_repository";
import {EOSConnector} from "../lib/eos_connector";
// @ts-ignore

export default class IssueMVPUserUsecase {
  private userRepository: UserRepository;
  private eosConnector: EOSConnector;

  constructor({
                userRepository,
                eosConnector
              }: {
    userRepository: UserRepository,
    eosConnector: EOSConnector,
  }) {
    console.log('IssueMVPUserUsecase constructor');
    this.userRepository = userRepository;
    this.eosConnector = eosConnector;
  }

  async execute(uuid: string, point: number) {
    const user = await this.userRepository.findByUuid(uuid);

    if (!user) {
      throw new Error(`User with uuid=${uuid} doesn't exist`);
    }

    if (point <= 0) {
      throw new Error(`point should be positive`);
    }

    await this.eosConnector.issuePoint(user.account, point);
  }
}