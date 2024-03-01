import { baseTokens } from "./base";
import { mainnetTokens } from "./mainnet";
import { Token } from "./types";

export const getTokenByAddress = (
  tokens: Token[],
  address: string | `0x${string}`,
) => {
  return tokens.find((token) => token.address === address);
};

export const getTokenlistByChainId = (
  chainId: number
) => {
  switch (chainId) {
    case 1: 
      return mainnetTokens
    case 8453:
      return baseTokens
  }
};
