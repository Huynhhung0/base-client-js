import { OfferInteraction, OfferResultAction } from '../repository/models/OfferInteraction';
import { OfferSearch } from '../repository/models/OfferSearch';
import OfferSearchResultItem from '../repository/models/OfferSearchResultItem';
import { Page } from '../repository/models/Page';
import { Pair } from '../repository/models/Pair';
import SearchRequest from '../repository/models/SearchRequest';
import { OfferSearchRequestInterestMode } from '../repository/search/OfferSearchRepository';

export enum SortOfferSearch {
    rank = 'rank',
    updatedAt = 'updatedAt',
    price = 'price',
    cashback = 'cashback'
}

export interface SearchManager {

    /**
     * deprecated (@see updateRequest)
     * @param searchRequest
     */
    createRequest(searchRequest: SearchRequest): Promise<SearchRequest>;

    // fixme change name of method to putRequests
    updateRequest(searchRequest: SearchRequest | Array<SearchRequest>): Promise<SearchRequest | Array<SearchRequest>>;

    cloneRequest(searchRequestIds: Array<number>): Promise<Array<SearchRequest>>;

    cloneOfferSearch(originToCopySearchRequestIds: Array<Pair<number, number>>): Promise<Array<OfferSearch>>;

    getMyRequests(id?: number): Promise<Array<SearchRequest>>;

    getRequestsByOwnerAndId(owner: string, id?: number): Promise<Array<SearchRequest>>;

    getRequestsByPage(page?: number, size?: number): Promise<Page<SearchRequest>>;

    deleteRequest(id: number): Promise<number>;

    getSuggestionByQuery(query: string, size?: number): Promise<Array<string>>;

    createSearchResultByQuery(
        query: string,
        searchRequestId: number,
        page?: number,
        size?: number,
        interests?: Array<string>,
        mode?: OfferSearchRequestInterestMode,
        filters?: Map<string, Array<string>>
    ): Promise<Page<OfferSearchResultItem>>;

    getSearchResult(searchRequestId: number, page?: number, size?: number): Promise<Page<OfferSearchResultItem>>;

    getSearchResultByOfferSearchId(
        offerSearchId: number,
        page?: number,
        size?: number
    ): Promise<Page<OfferSearchResultItem>>;

    getCountBySearchRequestIds(searchRequestIds: Array<number>): Promise<Map<number, number>>;

    getUserOfferSearches(
        page?: number,
        size?: number,
        unique?: boolean,
        searchIds?: Array<number>,
        state?: Array<OfferResultAction>,
        sort?: SortOfferSearch,
        interaction?: boolean
    ): Promise<Page<OfferSearchResultItem>>;

    getInteractions(
        offerIds?: Array<number> | undefined,
        states?: Array<OfferResultAction> | undefined,
        owner?: string | undefined
    ): Promise<Array<OfferInteraction>>;

    complainToSearchItem(searchResultId: number): Promise<void>;

    rejectSearchItem(searchResultId: number): Promise<void>;

    evaluateSearchItem(searchResultId: number): Promise<void>;

    confirmSearchItem(searchResultId: number): Promise<void>;

    claimPurchaseForSearchItem(searchResultId: number): Promise<void>;

    addResultItem(offerSearch: OfferSearch): Promise<void>;

    addEventToOfferSearch(event: string, offerSearchId: number): Promise<void>;

    getSearchRequestsByOwnerAndTag(owner: string, tag: string): Promise<Array<SearchRequest>>;

    getMySearchRequestsByTag(tag: string): Promise<Array<SearchRequest>>;
}
