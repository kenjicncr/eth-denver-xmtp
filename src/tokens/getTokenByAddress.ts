import { Token } from "./mainnet";

export const getTokenByAddress = (
  tokens: Token[],
  address: string | `0x${string}`,
) => {
  return tokens.find((token) => token.address === address);
};
