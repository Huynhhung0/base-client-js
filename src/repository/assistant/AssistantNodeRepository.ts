import { AccountRepository } from '../account/AccountRepository';
import Account from '../models/Account';
import DataRequest from '../models/DataRequest';
import { Site } from '../models/Site';
import { DataRequestRepository } from '../requests/DataRequestRepository';
import { SiteRepository } from '../site/SiteRepository';
import { NonceSource } from './NonceSource';
import { PermissionsSource } from './PermissionsSource';
import { SiteDataSource } from './SiteDataSource';

// this class assistant for only read data from Base-node. without any permissions
export class AssistantNodeRepository implements PermissionsSource, NonceSource, SiteDataSource {

    private accountRepository: AccountRepository;
    private dataRequestRepository: DataRequestRepository;
    private siteRepository: SiteRepository;

    public constructor(
        accountRepository: AccountRepository,
        dataRequestRepository: DataRequestRepository,
        siteRepository: SiteRepository
    ) {

        this.accountRepository = accountRepository;
        this.dataRequestRepository = dataRequestRepository;
        this.siteRepository = siteRepository;
    }

    public getGrandAccessRecords(publicKeyFrom: string, publicKeyTo: string): Promise<Array<DataRequest>> {
        return this.dataRequestRepository.getRequests(publicKeyFrom, publicKeyTo);
    }

    public getNonce(publicKey: string): Promise<number> {
        return this.accountRepository.getNonce(new Account(publicKey));
    }

    public getSiteData(origin: string): Promise<Site> {
        return this.siteRepository.getSiteData(origin);
    }

}
