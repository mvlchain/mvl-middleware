import {EOSConnector} from "./eos_connector";
import _ from 'lodash';

interface EOSAccount {
  name: string,
  publicKey: string,
}

export default class EOSConnectorMock implements EOSConnector {
  private accounts: EOSAccount[] = [];
  pushAction(account: string, actionName: string, data: {[key: string]: any}) {
    console.log('==== pushAction ====');
    console.log({actionName, data: JSON.stringify(data, null, 2)});
    return Promise.resolve();
  }
  createAccount(creator: string, account: string, publicKey: string): Promise<any> {
    console.log('==== createAccount ====');
    console.log({creator, account, publicKey});
    return Promise.resolve();
  }
  getAccount(account: string): Promise<any|null> {
    console.log('==== getAccount ====');
    const existingAccount = _.find(this.accounts, (acc) => acc.name === account);
    return Promise.resolve(existingAccount);
  }

  issuePoint(account: string, point: number): Promise<any> {
    return Promise.resolve();
  }
}