import {EOSConnector} from "./eos_connector";
import _ from 'lodash';
import { Api, JsonRpc } from 'eosjs';
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig'; // development only
import fetch from 'node-fetch';                            // node only; not needed in browsers
import { TextDecoder, TextEncoder } from 'text-encoding';  // node, IE11 and IE Edge Browsers
import config from "config";

interface EOSAccount {
  name: string,
  publicKey: string,
}

export default class EOSConnectorReal implements EOSConnector {
  private rpc: JsonRpc;
  private api: Api;

  constructor({
    endpoint
  }: {
    endpoint: string,
  }) {
    this.rpc = new JsonRpc(endpoint, {fetch});
    const eosPrivateKeys: string[] = config.get<any>("eos").private_keys;
    const signatureProvider = new JsSignatureProvider(eosPrivateKeys);
    this.api = new Api({ rpc: this.rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
  }

  pushAction(account: string, actionName: string, data: {[key: string]: any}) {
    console.log(data);
    return this.api.transact({
      actions: [{
        account,
        name: actionName,
        authorization: [{
          actor: account,
          permission: 'active'
        }],
        data
      }],
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
  }

  createAccount(creator: string, account: string, publicKey: string): Promise<any> {
    return this.api.transact({
      actions: [{
        account: "eosio",
        name: "newaccount",
        authorization: [{
          actor: "eosio",
          permission: "active",
        }],
        data: {
          creator: 'eosio',
          name: account,
          owner: {
            threshold: 1,
            keys: [{
              key: publicKey,
              weight: 1,
            }],
            accounts: [],
            waits: [],
          },
          active: {
            threshold: 1,
            keys: [{
              key: publicKey,
              weight: 1,
            }],
            accounts: [],
            waits: [],
          },
        }
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
  }

  async getAccount(account: string): Promise<any|null> {
    try {
      console.log('get account', account);
      const res = await this.rpc.get_account(account);
      console.log(res);
      return res;
    } catch (e) {
      if (e.message.startsWith("unknown key") && e.message.endsWith(`(0 ${account})`)) {
        return null; // not found user
      }
      console.error('get error');
      console.error(e);
      throw e;
    }
  }

  issuePoint(account: string, point: number): Promise<any> {
    return this.api.transact({
      actions: [{
        account: "mvp.token",
        name: "issue",
        authorization: [{
          actor: "mvp.token",
          permission: "active"
        }],
        data: {
          to: account,
          quantity: `${point} MVP`,
          memo: "mvp issue from middleware",
        }
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30
    });
  }
}