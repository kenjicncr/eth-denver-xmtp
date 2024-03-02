import { Reply } from "@xmtp/content-type-reply";
import { baseTokens } from "./base";
import { mainnetTokens } from "./mainnet";
import { Token } from "./types";
import { CurrencyRequest } from "../xmtp-content-types/currency-request";
import { CachedMessageWithId } from "@xmtp/react-sdk";
import { moonbeamTokens } from "./moonbeam";

export const getTokenByAddress = (
  tokens: Token[],
  address: string | `0x${string}`,
) => {
  return tokens.find((token) => token.address === address);
};

export const getTokenlistByChainId = (chainId: number) => {
  switch (chainId) {
    case 1:
      return mainnetTokens;
    case 8453:
      return baseTokens;
    case 1284:
      return moonbeamTokens;
    default:
      return [];
  }
};

export const findMatchingReply = (
  replies: CachedMessageWithId[],
  currencyRequest: CurrencyRequest | null,
  token: Token | null,
): CachedMessageWithId | undefined => {
  console.log(replies, currencyRequest);
  for (const reply of replies) {
    if (reply.content.content?.metadata && currencyRequest) {
      const contentMetadata = reply.content.content.metadata;
      console.log({ contentMetadata, currencyRequest });
      if (
        contentMetadata.amount.toString() === currencyRequest.amount &&
        contentMetadata.fromAddress === currencyRequest.from &&
        contentMetadata.toAddress === currencyRequest.to &&
        contentMetadata.currency === token?.symbol
      ) {
        return reply;
      }
    } else return undefined;
  }
  return undefined;
};
