import { EthereumUtils } from '../../EthereumUtils';
import { EthCryptoWallet, EthWalletData } from '../BaseTypes';
import { AbstractWalletValidator } from './AbstractWalletValidator';

export class EthWalletValidator extends AbstractWalletValidator<EthCryptoWallet, EthWalletData> {

    public validateSignature(wallet: EthWalletData): boolean {
        try {
            const signerAddress = EthereumUtils.recoverPersonalSignature(wallet.getSignedMessage());
            return signerAddress === wallet.data.address;

        } catch (e) {
            return false;
        }
    }
}
