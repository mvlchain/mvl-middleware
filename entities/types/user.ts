import UserEntity from "../../external/entities";

export interface User {
  uuid: string,
  account: string, // eos account
  privateKey: string,
  publicKey: string,
}