import { RepositoryStrategyType } from '../../RepositoryStrategyType';
import { HttpInterceptor } from './HttpInterceptor';
import { InterceptorCortege } from './InterceptorCortege';
export declare class RepositoryStrategyInterceptor implements HttpInterceptor {
    private strategy;
    constructor(strategy: RepositoryStrategyType);
    changeStrategy(strategy: RepositoryStrategyType): void;
    onIntercept(cortege: InterceptorCortege): Promise<InterceptorCortege>;
}
