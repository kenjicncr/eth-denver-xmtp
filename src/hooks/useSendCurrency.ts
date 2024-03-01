import { WriteContractResult } from "@wagmi/core";
import { TransactionReceipt, formatUnits, parseUnits } from "viem";
import { useAccount, useChainId, useWaitForTransaction } from "wagmi";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { erc20ABI } from "wagmi";
import { getTokenByAddress } from "../tokens/utils";
import { baseTokens } from "../tokens/base";

interface UseSendCurrency {
  amount: string | undefined;
  chainId: number | undefined;
  tokenAddress: `0x${string}` | undefined;
  from: `0x${string}` | undefined;
  to: `0x${string}` | undefined;
  onSendSuccess?: (data: TransactionReceipt) => void;
}
export function useSendCurrency({
  amount,
  chainId,
  tokenAddress,
  from,
  to,
  onSendSuccess,
}: UseSendCurrency) {
  const chainTokens = chainId === 8453 ? baseTokens : [];
  const tokenDecimals = tokenAddress
    ? getTokenByAddress(chainTokens, tokenAddress)?.decimals
    : undefined;
  console.log({ tokenAddress, to, tokenDecimals, amount });

  const amountBN = amount && BigInt(amount);

  const enabled = !!from && !!chainId && !!tokenAddress && !!from && !!to;

  const { config, error, isError } = usePrepareContractWrite({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "transfer",
    args: to && amountBN ? [to, amountBN] : undefined,
    chainId: chainId,
    account: from,
    enabled: enabled,
    onSuccess(data) {},
  });

  const { data, isLoading, isSuccess, write } = useContractWrite({
    ...config,
  });

  const items = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      console.log("Successfully sent", data);
      onSendSuccess && onSendSuccess(data);
    },
    enabled: !!data?.hash,
  });

  return { error, isError, isLoading, isSuccess, data, write };
}
