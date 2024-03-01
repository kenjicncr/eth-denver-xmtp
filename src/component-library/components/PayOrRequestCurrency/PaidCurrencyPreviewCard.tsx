import { CachedMessage } from "@xmtp/react-sdk";

import { CurrencyRequest } from "../../../xmtp-content-types/currency-request";
import {
  getTokenByAddress,
  getTokenlistByChainId,
} from "../../../tokens/utils";
import { mainnetTokens } from "../../../tokens/mainnet";
import { formatUnits } from "viem";
import { classNames } from "../../../helpers";
import { TransactionReference } from "@xmtp/content-type-transaction-reference";

function getChainName(chainId: number) {
  switch (chainId) {
    case 1:
      return "Ethereum Mainnet";
    case 3:
      return "Ropsten Testnet";
    case 4:
      return "Rinkeby Testnet";
    case 8453:
      return "Base";
    // Add more cases for other chain ids
    default:
      return "Unknown Chain";
  }
}

interface MessageContentControllerProps {
  message?: CachedMessage;
  isSelf: boolean;
}

export const PaidCurrencyPreviewCard = ({
  isSelf,
  message,
}: MessageContentControllerProps) => {
  const content = message?.content;
  const transactionReference = content as TransactionReference;
  if (!transactionReference) return null;

  const tokenList = getTokenlistByChainId(
    transactionReference?.networkId as number,
  );

  const isDollar =
    transactionReference.metadata?.currency === "USDC" ||
    transactionReference.metadata?.currency === "USDT";

  const amount =
    transactionReference?.metadata !== undefined
      ? Number(
          formatUnits(
            BigInt(transactionReference?.metadata?.amount || "0"),
            transactionReference?.metadata?.decimals!,
          ),
        ).toLocaleString()
      : "0";

  return (
    <div
      className={classNames(
        " bg-black",
        isSelf ? "rounded-bl-xl" : "rounded-tl-xl",
        isSelf ? "rounded-bl-xl" : "rounded-br-xl",
        "rounded-tr-xl",
        "rounded-tl-xl",
        "-m-2",
        "-ml-3",
        "-mr-3",
        "text-white",
        "h-48",
        "flex",
        "flex-col",
        "items-between",
      )}>
      <div className="flex items-center mx-2 mt-2 text-sm font-medium">
        <svg
          width="16"
          height="16"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 16C0 7.16344 7.19457 0 16.0695 0C24.9387 0 31.7912 7.0303 31.9999 15.9307C31.9999 18.7706 31.026 21.1602 28.5912 23.4113C26.5338 25.3135 23.026 25.5931 20.4523 24.1732C18.6154 23.1181 17.1996 20.8711 16 19.2208L13.7739 22.6147H8.97389L13.4956 15.9305L9.11302 9.35065H14.0521L16.0347 12.7446L17.9826 9.35065H22.9565L18.4347 15.9307C18.4347 15.9307 20.5912 19.2208 21.7739 20.5022C22.9565 21.7836 25.113 21.8182 26.5043 20.4329C28.034 18.9098 28.3764 17.6971 28.3825 15.9307C28.4064 9.09397 22.9524 3.60173 16.0695 3.60173C9.19239 3.60173 3.61738 9.15263 3.61738 16C3.61738 22.8474 9.19239 28.3983 16.0695 28.3983C17.0208 28.3983 17.9325 28.3187 18.8173 28.1212L19.6521 31.619C18.3931 31.9001 17.3062 32 16.0695 32C7.19457 32 0 24.8366 0 16Z"
            fill="#FFFFFF"
          />
        </svg>
        <p className="ml-1">Pay</p>
      </div>
      <div className="relative w-full h-full flex flex-col items-between p-4 px-12 pt-8">
        {isSelf ? <p>You sent</p> : <p>You received</p>}
        <div className="flex-1">
          <p className="text-4xl text-center">
            <span className="font-bold">
              {isDollar
                ? `$${amount}`
                : `${amount} ${transactionReference?.metadata?.currency}` ||
                  "0"}
            </span>
          </p>
          {transactionReference && (
            <p className="text-center text-sm">
              {getChainName(transactionReference?.networkId as number)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
