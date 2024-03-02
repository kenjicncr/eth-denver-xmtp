import React from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { Combobox } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';

export const ChainSelection = () => {
    const { chain, chains } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();

    // Handler to switch the network
    const handleSwitchNetwork = async (chainId: number) => {
        await switchNetwork?.(chainId);
    };

    return (
        <div className="flex">
            {chain ? (
                <Combobox value={chain} onChange={({ id }) => handleSwitchNetwork(id)}>
                    <Combobox.Button className="w-full items-center justify-between flex rounded-2xl border border-gray-300 bg-white px-4 py-2 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                        {chain.name || "Select a network"}
                        <ChevronDownIcon className="h-5 w-5 text-gray-400"
                            aria-hidden="true" />
                    </Combobox.Button>
                    <Combobox.Options className="absolute mt-1 max-h-60 flex-1 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border-2">
                        {chains.map((chainOption) => (
                            <Combobox.Option
                                key={chainOption.id}
                                value={chainOption}
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                    }`
                                }
                            >
                                {({ selected, active }) => (
                                    <>
                                        <span
                                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                }`}
                                        >
                                            {/* Icon or indicator for selected item */}
                                            {chainOption.name}
                                        </span>

                                        {selected ? (
                                            <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-indigo-600'
                                                    }`}
                                            >
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </Combobox>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};