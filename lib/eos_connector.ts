export interface EOSConnector {
  pushAction(account: string, actionName: string, data: {[key: string]: any}): Promise<any>;
  createAccount(creator: string, account: string, publicKey: string): Promise<any>;
  getAccount(account: string): Promise<any|null>;
  issuePoint(account: string, point: number): Promise<any>;
}