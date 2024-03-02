import { useEffect, useState } from 'react';
import { useChainId } from 'wagmi';
import { getTokenlistByChainId } from '../tokens/utils';
import { Token } from '../tokens/types';

export const useTokenList = () => {
    const chainId = useChainId();
    const [tokens, setTokens] = useState<Token[] | undefined>([]);

    useEffect(() => {
        setTokens(getTokenlistByChainId(chainId))
    }, [chainId]);

    return { tokens };
};