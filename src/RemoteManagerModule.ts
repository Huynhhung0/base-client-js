import { BehaviorSubject } from 'rxjs';
import {
    AccessTokenInterceptor,
    AccountManager,
    DataRequestManager,
    ExternalServicesManager,
    ManagersModule,
    OfferManager,
    OfferRankManager,
    ProfileManager,
    RpcTransport,
    SearchManager,
    TransportFactory,
    VerifyManager,
    WalletManager
} from './Base';
import { RemoteAccountManagerImpl } from './manager/remote/RemoteAccountManagerImpl';
import { RemoteDataRequestManagerImpl } from './manager/remote/RemoteDataRequestManagerImpl';
import { RemoteExternalServicesManagerImpl } from './manager/remote/RemoteExternalServicesManagerImpl';
import { RemoteOfferManagerImpl } from './manager/remote/RemoteOfferManagerImpl';
import { RemoteOfferRankManagerImpl } from './manager/remote/RemoteOfferRankManagerImpl';
import { RemoteProfileManagerImpl } from './manager/remote/RemoteProfileManagerImpl';
import { RemoteSearchManagerImpl } from './manager/remote/RemoteSearchManagerImpl';
import { RemoteVerifyManagerImpl } from './manager/remote/RemoteVerifyManagerImpl';
import { RemoteWalletManagerImpl } from './manager/remote/RemoteWalletManagerImpl';
import Account from './repository/models/Account';
import { TransportInterceptor } from './repository/source/TransportInterceptor';
import { BasicLogger, Logger } from './utils/BasicLogger';

export class RemoteManagerModule extends ManagersModule {

    private readonly _walletManager: WalletManager;
    private readonly _accountManager: AccountManager;
    private readonly _profileManager: ProfileManager;
    private readonly _dataRequestManager: DataRequestManager;
    private readonly _offerManager: OfferManager;
    private readonly _searchManager: SearchManager;
    private readonly _verifyManager: VerifyManager;
    private readonly _externalServicesManager: ExternalServicesManager;
    private readonly _authAccountBehavior: BehaviorSubject<Account> = new BehaviorSubject<Account>(new Account());
    private readonly _offerRankManager: OfferRankManager;
    private readonly transport: RpcTransport;

    public constructor(remoteManagersEndPoint: string, logger: Logger = new BasicLogger()) {
        super();

        const interceptor = new AccessTokenInterceptor();
        this.transport = TransportFactory.createJsonRpcHttpTransport(remoteManagersEndPoint, logger)
            .addInterceptor(interceptor);

        this._accountManager = new RemoteAccountManagerImpl(this.transport, interceptor, this._authAccountBehavior);
        this._dataRequestManager = new RemoteDataRequestManagerImpl(this.transport);
        this._profileManager = new RemoteProfileManagerImpl(this.transport);
        this._offerManager = new RemoteOfferManagerImpl(this.transport);
        this._searchManager = new RemoteSearchManagerImpl(this.transport);
        this._walletManager = new RemoteWalletManagerImpl(this.transport);
        this._verifyManager = new RemoteVerifyManagerImpl(this.transport);
        this._externalServicesManager = new RemoteExternalServicesManagerImpl(this.transport);
        this._offerRankManager = new RemoteOfferRankManagerImpl(this.transport);
    }

    public getAccountManager(): AccountManager {
        return this._accountManager;
    }

    public getDataRequestManager(): DataRequestManager {
        return this._dataRequestManager;
    }

    public getDefaultTransport(): TransportInterceptor<object> {
        return this.transport;
    }

    public getExternalServicesManager(): ExternalServicesManager {
        return this._externalServicesManager;
    }

    public getOfferManager(): OfferManager {
        return this._offerManager;
    }

    public getOfferRankManager(): OfferRankManager {
        return this._offerRankManager;
    }

    public getProfileManager(): ProfileManager {
        return this._profileManager;
    }

    public getSearchManager(): SearchManager {
        return this._searchManager;
    }

    public getVerifyManager(): VerifyManager {
        return this._verifyManager;
    }

    public getWalletManager(): WalletManager {
        return this._walletManager;
    }
}
