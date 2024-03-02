import { CachedMessage } from "@xmtp/react-sdk";
import { CurrencyRequest } from "../../../xmtp-content-types/currency-request";
import { mainnet, moonbeam, base, Chain } from "@wagmi/core/chains";
import { formatUnits } from "ethers";
import {
  getTokenByAddress,
  getTokenlistByChainId,
} from "../../../tokens/utils";
import { XCircleIcon } from "@heroicons/react/outline";
import { baseTokens } from "../../../tokens/base";

export const getChainByChainId = (chainId: number): Chain | null => {
  switch (chainId) {
    case 1:
      return mainnet;
    case 8453:
      return base;
    case 1284:
      return moonbeam;
    default:
      return null;
  }
};
interface PayOrRequestCurrencyInputPreviewCardProps {
  currencyRequest: CurrencyRequest;
  onCancel: () => void;
}

export const PayOrRequestCurrencyInputPreviewCard = ({
  currencyRequest,
  onCancel,
}: PayOrRequestCurrencyInputPreviewCardProps) => {
  const tokenList = currencyRequest
    ? getTokenlistByChainId(currencyRequest.chainId)
    : null;

  const token = tokenList?.[0];

  const isDollar = token && token?.decimals === 6;

  return (
    <div className="relative m-4 p-8 h-48 w-fit min-w-[300px] bg-zinc-800 text-white rounded-3xl">
      <div className="absolute top-1 right-1">
        <button onClick={onCancel}>
          <XCircleIcon height={40} width={40} />
        </button>
      </div>
      <div className="flex flex-col items-center">
        <p>Request</p>

        <p className="text-4xl">
          <span className="font-bold">
            {isDollar
              ? `$${Number(
                  formatUnits(currencyRequest.amount, token?.decimals),
                ).toLocaleString()}`
              : `${Number(
                  formatUnits(currencyRequest.amount, token?.decimals),
                ).toLocaleString()}{" "}
            ${token?.symbol}`}
          </span>
        </p>
        {currencyRequest.message && (
          <div className="mt-8 text-center">
            <p className="text-sm  text-gray-200">
              For {currencyRequest.message}
            </p>
          </div>
        )}
        <div className="mt-2 text-center">
          <p className="text-sm  text-gray-200">
            on {getChainByChainId(currencyRequest.chainId)?.name}
          </p>
        </div>
      </div>
    </div>
  );
};
