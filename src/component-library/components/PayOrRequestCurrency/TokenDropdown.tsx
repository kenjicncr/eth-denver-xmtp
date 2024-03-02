import { Menu } from "@headlessui/react";
import { Token } from "../../../tokens/types";
import { Button } from "../../ui/button";

export const TokenDropDown = ({
  tokens,
  onSelectToken,
  selectedToken,
}: {
  tokens: Token[];
  onSelectToken: (token: Token) => void;
  selectedToken: Token;
}) => {
  return (
    <div className="relative">
      <Menu>
        <Menu.Button className="relative min-w-[100px] text-center cursor-pointer rounded-lg border bg-zinc-800 py-2 px-8 shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          {selectedToken?.name}
        </Menu.Button>
        <Menu.Items className="absolute w-full flex flex-col mt-4">
          {tokens &&
            tokens.length > 0 &&
            tokens.map((token, id) => {
              return (
                <Menu.Item key={id}>
                  {({ active }) => (
                    <Button
                      variant="secondary"
                      className={`${
                        active && "bg-blue-500"
                      } border border-b-1 border-b-zinc-400 rounded-none`}
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
