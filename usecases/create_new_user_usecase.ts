import {UserRepository} from "../entities/repositories/user_repository";
import {EOSConnector} from "../lib/eos_connector";
import {User} from "../entities/types/user";
// @ts-ignore
import ecc from 'eosjs-ecc'

export default class CreateNewUserUseCase {
  private userRepository: UserRepository;
  private eosConnector: EOSConnector;

  constructor({
    userRepository,
    eosConnector
  }: {
    userRepository: UserRepository,
    eosConnector: EOSConnector,
  }) {
    console.log('CreateNewUserUseCase constructor');
    this.userRepository = userRepository;
    this.eosConnector = eosConnector;
  }

  async execute(uuid: string): Promise<User> {
    const existingUser = await this.userRepository.findByUuid(uuid);
    if (existingUser) {
      throw new Error(`User with uuid=${uuid} already exists`);
    }

    console.log('ecc init...');
    await ecc.initialize(); // it does nothing if it is already initialized
    console.log('ecc inited');

    // create new random account
    const prefix = 'mvler.';
    const wordlen = 12 - prefix.length;
    let account;
    const chars = "12345abcdefghijklmnopqrstuvwxyz";
    do {
      const word = [];
      for (let i=0; i<wordlen; i++) {
        word.push(chars.charAt(Math.floor(Math.random() * chars.length)));
      }
      account = `${prefix}${word.join("")}`;
    } while(!!(await this.eosConnector.getAccount(account)));

    const creator = "eosio";
    const privateKey = await ecc.randomKey();
    const publicKey = ecc.privateToPublic(privateKey);

    console.log("try to make a new account");
    const createdEOSAccount = await this.eosConnector.createAccount(creator, account, publicKey);
    console.log(createdEOSAccount);

    const createdUser = await this.userRepository.save({
      uuid: uuid,
      account: account,
      privateKey: privateKey,
      publicKey: publicKey
    });

    return createdUser;
  }
}
