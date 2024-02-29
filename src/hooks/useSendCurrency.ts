import { useAccount, useChainId } from "wagmi";
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { erc20ABI } from "wagmi";

export function useSendCurrency(
    amount: bigint | undefined,
    chainId: number | undefined,
    tokenAddress: `0x${string}` | undefined,
    from: `0x${string}` | undefined,
    to: `0x${string}` | undefined,
) {
    const enabled = !!from && !!chainId && !!tokenAddress && !!from && !!to

    const { config, error, isError } = usePrepareContractWrite({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'transfer',
        args: to && amount ? [to, amount] : undefined,
        chainId: chainId,
        account: from,
        enabled: enabled
    })
    
    const { data, isLoading, isSuccess, write } = useContractWrite(config)

    return { error, isError, isLoading, isSuccess, data, write }
}