import Base, { CompareAction, Offer } from '../../src/Base';
import Account from '../../src/repository/models/Account';
import { OfferPrice } from '../../src/repository/models/OfferPrice';
import { OfferPriceRules } from '../../src/repository/models/OfferPriceRules';
import { RepositoryStrategyType } from '../../src/repository/RepositoryStrategyType';
import { RpcTransport } from '../../src/repository/source/rpc/RpcTransport';
import { TransportFactory } from '../../src/repository/source/TransportFactory';
import { TokenType } from '../../src/utils/keypair/rpc/RpcToken';
import AuthenticatorHelper from '../AuthenticatorHelper';

require('chai').use(require('chai-as-promised')).should();
const someSigMessage = 'some unique message for signature';
const baseNodeUrl = process.env.BASE_NODE_URL || 'https://base2-bitclva-com.herokuapp.com';
const rpcSignerHost = process.env.SIGNER || 'http://localhost:3545';
const rpcTransport: RpcTransport = TransportFactory.createJsonRpcHttpTransport(rpcSignerHost);
const authenticatorHelper: AuthenticatorHelper = new AuthenticatorHelper(rpcTransport);

// process.on('unhandledRejection', err => {
//     // Will print "unhandledRejection err is not defined"
//     console.log('unhandledRejection', err);
// });

async function createUser(user: Base, pass: string): Promise<Account> {
    const accessToken = await authenticatorHelper.generateAccessToken(pass);
    await user.accountManager.authenticationByAccessToken(accessToken, TokenType.BASIC, someSigMessage);
    await user.accountManager.unsubscribe();

    return await user.accountManager.authenticationByAccessToken(accessToken, TokenType.BASIC, someSigMessage);
}

describe('Offer, local price matching', async () => {
    const passPhraseSeller: string = 'Seller';
    const passPhraseBusinessBuyer: string = 'Business';  // need 5 symbols

    const baseSeller: Base = createBase();
    const baseBusinessBuyer: Base = createBase();

    function createBase(): Base {
        return new Base(
            baseNodeUrl,
            'localhost',
            RepositoryStrategyType.Postgres,
            rpcSignerHost
        );
    }

    function offerFactory(isMultiPrices: boolean = false): Offer {
        const offerTags = new Map<string, string>([['product', 'car']]);
        const compareUserTag = new Map<string, string>([['age', '10']]);
        const rules = new Map<string, CompareAction>([['age', CompareAction.MORE]]);
        const offer = new Offer(
            'it is offer description',
            'it is title of offer',
            '', '1', offerTags, compareUserTag, rules
        );
        if (isMultiPrices) {
            offer.offerPrices = [
                new OfferPrice(
                    0, 'special price for 40 and 50 years old male customers', '1.5', [
                        new OfferPriceRules(0, 'sex', 'male', CompareAction.EQUALLY),
                        new OfferPriceRules(0, 'age', '40', CompareAction.EQUALLY)
                    ]
                ),
                new OfferPrice(
                    0, 'special price for 40 and 50 years old male customers', '1.7', [
                        new OfferPriceRules(0, 'sex', 'male', CompareAction.EQUALLY),
                        new OfferPriceRules(0, 'age', '40', CompareAction.EQUALLY),
                        new OfferPriceRules(0, 'country', 'USA', CompareAction.EQUALLY)
                    ]
                ),
                new OfferPrice(
                    0, 'special price for young girls customers < 15', '0.9', [
                        new OfferPriceRules(0, 'sex', 'female', CompareAction.EQUALLY),
                        new OfferPriceRules(0, 'age', '15', CompareAction.LESS)
                    ]
                ),
                new OfferPrice(
                    0, 'special price for old men USA customers', '0.7', [
                        new OfferPriceRules(0, 'age', '70', CompareAction.MORE_OR_EQUAL),
                        new OfferPriceRules(0, 'country', 'USA', CompareAction.EQUALLY)
                    ]
                )
            ];
        }

        return offer;
    }

    beforeEach(async () => {
        await createUser(baseSeller, passPhraseSeller);
        await createUser(baseBusinessBuyer, passPhraseBusinessBuyer);
    });

    after(async () => {
        // rpcClient.disconnect();
    });

    it('should return empty array if the user does not match any offers rules', async () => {
        try {
            // Buyer must have necessary keys - value
            await baseBusinessBuyer.profileManager.updateData(new Map([['age', '20']]));
            await baseBusinessBuyer.profileManager.updateData(new Map([['sex', 'male']]));
            await baseBusinessBuyer.profileManager.updateData(new Map([['country', 'USA']]));

            // Seller is creating offer
            const offer = offerFactory(true);
            const createdOffer = await baseSeller.offerManager.saveOffer(offer);

            // Buyer gets necessary keys which have to be here (local) for price calculation
            const buyerData = await baseBusinessBuyer.profileManager.getData();
            const prices = createdOffer.validPrices(buyerData);

            // Buyer is retrieving values
            prices.length.should.be.eql(0);

        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should return proper price if the user has matched data', async () => {
        try {
            // Buyer must have necessary keys - value
            await baseBusinessBuyer.profileManager.updateData(new Map([['age', '40']]));
            await baseBusinessBuyer.profileManager.updateData(new Map([['sex', 'male']]));

            // Seller is creating offer
            const offer = offerFactory(true);
            const createdOffer = await baseSeller.offerManager.saveOffer(offer);

            // Buyer gets necessary keys which have to be here (local) for price calculation
            const buyerData = await baseBusinessBuyer.profileManager.getData();
            const prices = createdOffer.validPrices(buyerData);

            // Buyer is retrieving values
            prices.length.should.be.eql(1);
            prices[0].worth.should.be.eql('1.5');

        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should return set of prices base on relevant data', async () => {
        try {
            // Buyer must have necessary keys - value
            await baseBusinessBuyer.profileManager.updateData(new Map([['age', '40']]));
            await baseBusinessBuyer.profileManager.updateData(new Map([['sex', 'male']]));
            await baseBusinessBuyer.profileManager.updateData(new Map([['country', 'USA']]));

            // Seller is creating offer
            const offer = offerFactory(true);
            const createdOffer = await baseSeller.offerManager.saveOffer(offer);

            // Buyer gets necessary keys which have to be here (local) for price calculation
            const buyerData = await baseBusinessBuyer.profileManager.getData();
            const prices = createdOffer.validPrices(buyerData);

            // Buyer is retrieving values
            prices.length.should.be.eql(2);
            prices[0].worth.should.be.eql('1.5');
            prices[1].worth.should.be.eql('1.7');

        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should return price base on numeric value', async () => {
        try {
            // Buyer must have necessary keys - value
            await baseBusinessBuyer.profileManager.updateData(new Map([['age', '10']]));
            await baseBusinessBuyer.profileManager.updateData(new Map([['sex', 'female']]));

            // Seller is creating offer
            const offer = offerFactory(true);
            const createdOffer = await baseSeller.offerManager.saveOffer(offer);

            // Buyer gets necessary keys which have to be here (local) for price calculation

            const buyerData = await baseBusinessBuyer.profileManager.getData();
            const prices = createdOffer.validPrices(buyerData);

            // Buyer is retrieving values
            prices[0].worth.should.be.eql('0.9');

        } catch (e) {
            console.log(e);
            throw e;
        }
    });

    it('should return empty price if the user does not have necessary fields', async () => {
        try {
            // Buyer must have necessary keys - value
            await baseBusinessBuyer.profileManager.updateData(new Map([['age', '20']]));
            await baseBusinessBuyer.profileManager.updateData(new Map([['sex', 'male']]));

            // Seller is creating offer
            const offer = offerFactory(true);
            const createdOffer = await baseSeller.offerManager.saveOffer(offer);

            // Buyer gets necessary keys which have to be here (local) for price calculation
            const buyerData = await baseBusinessBuyer.profileManager.getData();
            const prices = createdOffer.validPrices(buyerData);

            // Buyer is retrieving values
            prices.length.should.be.eql(0);

        } catch (e) {
            console.log(e);
            throw e;
        }
    });
});
