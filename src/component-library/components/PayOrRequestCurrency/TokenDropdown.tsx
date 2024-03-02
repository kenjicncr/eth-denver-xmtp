import { Menu } from "@headlessui/react";
import { Token } from "../../../tokens/types";
import { Button } from "../../ui/button";
import { useChainId } from "wagmi";
import { useEffect } from "react";

export const TokenDropDown = ({
  tokens,
  onSelectToken,
  selectedToken,
}: {
  tokens: Token[];
  onSelectToken: (token: Token) => void;
  selectedToken: Token;
}) => {

  const chainId = useChainId();

  useEffect(() => {
    onSelectToken(tokens[0])
  },[chainId])
   
  return (
    <div className="w-full relative mt-2">
      <Menu>
        <Menu.Button className="relative w-full min-w-[100px] text-center cursor-pointer rounded-lg border bg-zinc-800 py-2 px-8 shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          {selectedToken?.symbol}
        </Menu.Button>
        <Menu.Items className="absolute bg-zinc-800 text-center top-9 mt-1 max-h-60 w-full overflow-auto rounded-md  py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
          {tokens &&
            tokens.length > 0 &&
            tokens.map((token, id) => {
              return (
                <Menu.Item key={id}>
                  {({ active }) => (
                    <Button
                      variant="secondary"
                      className={`relative cursor-pointer select-none py-2  px-4 w-full ${
                        active
                        ? "bg-zinc-800 hover:bg-zinc-900 text-white"
                        : "text-white"
                      }`}
                      onClick={() => {
                        onSelectToken(token);
                      }}>
                      {token.name}
                    </Button>
                  )}
                </Menu.Item>
              );
            })}
        </Menu.Items>
      </Menu>
    </div>
  );
};
