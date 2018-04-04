import { AccountRepository } from './AccountRepository';
import { HttpMethod } from '../source/http/HttpMethod';
import { HttpTransport } from '../source/http/HttpTransport';
import Account from '../models/Account';

export default class AccountRepositoryImpl implements AccountRepository {

    private readonly SIGN_UP: string = '/registration';
    private readonly SIGN_IN: string = '/exist';
    private readonly DELETE: string = '/delete';

    private transport: HttpTransport;

    constructor(transport: HttpTransport) {
        this.transport = transport;
    }

    registration(account: Account): Promise<Account> {
        return this.transport
            .sendRequest(this.SIGN_UP, HttpMethod.Post, account)
            .then((response) => Object.assign(new Account(), response.json));
    }

    checkAccount(account: Account): Promise<Account> {
        return this.transport
            .sendRequest(this.SIGN_IN, HttpMethod.Post, account)
            .then((response) => Object.assign(new Account(), response.json));
    }

    unsubscribe(account: Account): Promise<Account> {
        return this.transport
            .sendRequest(this.DELETE, HttpMethod.Delete, account)
            .then((response) => Object.assign(new Account(), response.json));
    }

}
