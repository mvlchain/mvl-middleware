import {MVLActionLog} from "../types/mvl_action_log";
import {User} from "../types/user";

export interface MVLLogRepository {
  save(log: MVLActionLog): Promise<MVLActionLog>;
  findAllByUser(account: string): Promise<MVLActionLog[]>;
  findAllByUser(user: User): Promise<MVLActionLog[]>;
}