import {UserRepository} from "../../../entities/repositories/user_repository";
import {EOSConnector} from "../../../lib/eos_connector";
import InMemoryUserRepository from "../../../external/repositories/inmemory/user_repository";
import EOSConnectorMock from "../../../lib/eos_connector.mock";
import CreateNewUserUseCase from "../../../usecases/create_new_user_usecase";

describe.only('createNewUser', () => {
  let userRepository: UserRepository;
  let eosConnector: EOSConnector;

  beforeAll(() => {
    userRepository = new InMemoryUserRepository();
    eosConnector = new EOSConnectorMock();
  });

  it("should create a new user", async () => {
    // const usecase: CreateNewUserUseCase = new CreateNewUserUseCase({userRepository: userRepository, eosConnector: eosConnector});
    // const user = await usecase.execute('drh@snu.ac.kr');
    // expect(user).not.toBe(null);
    // expect(user.email).toEqual('drh@snu.ac.kr');
  });
});