import Account from './Account';

export default class Profile {

    private readonly _data: Map<string, string>;
    private readonly _account: Account;

    constructor(data: Map<string, string>, account: Account) {
        this._data = data;
        this._account = account;
    }

    get data(): Map<string, string> {
        return this._data as Map<string, string>;
    }

    get account(): Account {
        return this._account;
    }

}
