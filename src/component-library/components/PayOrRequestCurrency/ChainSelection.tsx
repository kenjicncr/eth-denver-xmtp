import React from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { Combobox, Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";

export const ChainSelection = () => {
  const { chain, chains } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  // Handler to switch the network
  const handleSwitchNetwork = async (chainId: number) => {
    await switchNetwork?.(chainId);
  };

  return (
    <div className="flex relative mt-2">
      {chain ? (
        <Listbox value={chain} onChange={({ id }) => handleSwitchNetwork(id)}>
          <Listbox.Button className="relative w-full min-w-[100px] text-center cursor-pointer rounded-lg border bg-zinc-800 py-2 px-8 shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            {chain.name || "Select a network"}
          </Listbox.Button>
          <Listbox.Options className="absolute bg-zinc-800 text-center top-9 mt-1 max-h-60 w-full overflow-auto rounded-md  py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {chains.map((chainOption) => (
              <Listbox.Option
                key={chainOption.id}
                value={chainOption}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2  px-4 ${
                    active
                      ? "bg-zinc-800 hover:bg-zinc-900 text-white"
                      : "text-white"
                  }`
                }>
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}>
                      {/* Icon or indicator for selected item */}
                      {chainOption.name}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
