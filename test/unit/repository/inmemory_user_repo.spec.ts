import {User} from "../../../entities/types/user";
import uuidv4 from 'uuid/v4';
import InMemoryUserRepository from "../../../external/repositories/inmemory/user_repository";

describe.only('InMemoryUserRepoTest', () => {
  let userRepo: InMemoryUserRepository;
  beforeAll(() => {
    userRepo = new InMemoryUserRepository();
  });

  it("should add a new user", async () => {
    // const user: User = {
    //   email: "drh@snu.ac.kr",
    //   account: 'drhdrh',
    //   private_key: uuidv4(),
    //   public_key: uuidv4(),
    // };
    //
    // await userRepo.save(user);
    // expect(user.id).toBe(1);
  });

  it("should find a user", async () => {
    // let user = await userRepo.findByEmail('drh@snu.ac.kr');
    // expect(user).not.toBe(null);
    // expect(user!.email).toEqual('drh@snu.ac.kr');
    // expect(user!.id).toEqual(1);
    //
    // user = await userRepo.findByAccount('drhdrh');
    // expect(user).not.toBe(null);
    // expect(user!.email).toEqual('drh@snu.ac.kr');
    // expect(user!.id).toEqual(1);
    //
    // user = await userRepo.findById(1);
    // expect(user).not.toBe(null);
    // expect(user!.email).toEqual('drh@snu.ac.kr');
    // expect(user!.id).toEqual(1);
  });

  it("should update an user", async () => {
    // const user = await userRepo.findByEmail('drh@snu.ac.kr');
    // expect(user).not.toBe(null);
    // user!.account = 'drhdrh2';
    // await userRepo.save(user!);
    // // reload
    // const user2 = await userRepo.findByEmail('drh@snu.ac.kr');
    // expect(user2!.account).toEqual('drhdrh2');
  })
});