import {MVLLogRepository} from "../../../entities/repositories/mvl_log_repository";
import {MVLActionLog} from "../../../entities/types/mvl_action_log";
import {User} from "../../../entities/types/user";
import _ from 'lodash';

export default class InMemoryMVLLogRepository implements MVLLogRepository {
  private logs: MVLActionLog[] = [];

  save(log: MVLActionLog): Promise<MVLActionLog> {
    if (log.id) {
      // update
      const index = _.findIndex(this.logs, (log2) => log.id === log2.id);
      this.logs[index] = _.cloneDeep(log);
      return Promise.resolve(log);
    } else {
      // insert
      const lastLog = _.last(this.logs);
      const newId = lastLog && ((lastLog.id || 0) + 1) || 1;
      this.logs.push({id: newId, ..._.cloneDeep(log)});
      log.id = newId;
      return Promise.resolve(log);
    }
  }

  findAllByUser(userOrAccount: string | User): Promise<MVLActionLog[]> {
    if (typeof userOrAccount === 'string') {
      return Promise.resolve(_.filter(this.logs, (log) => log.beneficiaryAccount === userOrAccount));
    }
    return Promise.resolve(_.filter(this.logs, (log) => log.beneficiaryAccount === userOrAccount.account));
  }
}