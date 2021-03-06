import AccountRepositoryImpl from '../account/AccountRepositoryImpl';
import { NodeInfoRepositoryImpl } from '../node/NodeInfoRepositoryImpl';
import DataRequestRepositoryImpl from '../requests/DataRequestRepositoryImpl';
import { SiteRepositoryImpl } from '../site/SiteRepositoryImpl';
import { HttpTransport } from '../source/http/HttpTransport';
import { AssistantNodeRepository } from './AssistantNodeRepository';

export class AssistantNodeFactory {

    public static defaultNodeAssistant(httpTransport: HttpTransport): AssistantNodeRepository {
        const accountRepository = new AccountRepositoryImpl(httpTransport);
        const dataRequestRepository = new DataRequestRepositoryImpl(httpTransport);
        const siteRepository = new SiteRepositoryImpl(httpTransport);
        const nodeInfoRepository = new NodeInfoRepositoryImpl(httpTransport);

        return new AssistantNodeRepository(
            accountRepository,
            dataRequestRepository,
            siteRepository,
            nodeInfoRepository
        );
    }
}
