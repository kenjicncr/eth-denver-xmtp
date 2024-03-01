import { t } from "i18next";
import { useState, Fragment, useEffect } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { parseUnits } from "ethers/utils";

import CurrencyInput, {
  CurrencyInputProps,
  CurrencyInputOnChangeValues,
} from "react-currency-input-field";
import { RecipientAddress } from "../../../store/xmtp";
import { Avatar } from "../Avatar/Avatar";
import { CurrencyRequest } from "../../../xmtp-content-types/currency-request";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { ContactsCombobox } from "./ContactsCombobox";
import { baseTokens } from "../../../tokens/base";
import { HarpieAlert } from "./HarpieAlert";
import { useHarpieValidateAddress } from "../../../hooks/useHarpieValidateAddress";

const shortenAddress = (address: string, chars = 4): string => {
  const prefix = address.slice(0, chars);
  const suffix = address.slice(-chars);
  return `${prefix}...${suffix}`;
};

interface SendOrRequestCurrencyProps {
  onSend?: () => void;
  onRequest?: (currencyRequest: CurrencyRequest) => void;
  onOpen?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  clientAddress?: string | null;
  /**
   * What, if any, resolved address is there?
   */
  resolvedAddress?: {
    displayAddress: string;
    walletAddress?: string;
  };
  /**
   * What are the props associated with the avatar?
   */
  avatarUrlProps?: {
    // What is the avatar url?
    url?: string;
    // Is the avatar url loading?
    isLoading?: boolean;
    // What's the address of this wallet?
    address?: string;
  };
  value: string;
  note: string;
  onChangeValue: (value: string) => void;
  onChangeNote: (note: string) => void;
  onPay: (currencyRequest: CurrencyRequest) => void;
}
export const PayOrRequestCurrencyModal = ({
  isOpen,
  onClose,
  onPay,
  onRequest,
  resolvedAddress,
  avatarUrlProps,
  clientAddress,
  onChangeNote,
  onChangeValue,
  value,
  note,
}: SendOrRequestCurrencyProps) => {
  const tokenList = baseTokens;
  const USDC = tokenList[0];
  const prefix = "$";

  const [className, setClassName] = useState("");
  const [isFlagged, setIsFlagged] = useState(false);
  /**
   * Handle validation
   */
  const handleOnValueChange: CurrencyInputProps["onValueChange"] = (
    _value,
    name,
    _values,
  ) => {
    if (!_value) {
      setClassName("");
      onChangeValue("");
      return;
    }

    setClassName("is-valid");
    onChangeValue(_value);
  };

  const closeModal = () => {
    onClose && onClose();
  };

  const handleCurrencyRequest = () => {
    if (onRequest) {
      if (resolvedAddress?.displayAddress) {
        const currencyRequest: CurrencyRequest = {
          amount: parseUnits(value, USDC.decimals).toString(),
          chainId: 8453,
          token: USDC.address as `0x${string}`,
          from: resolvedAddress.displayAddress as `0x${string}`,
          to: clientAddress as `0x${string}`,
          message: note,
        };
        onRequest(currencyRequest);

        closeModal();
      }
    }
  };

  const handlePayRequest = () => {
    if (onPay) {
      if (resolvedAddress?.displayAddress) {
        const currencyRequest: CurrencyRequest = {
          amount: parseUnits(value, USDC.decimals).toString(),
          chainId: 8453,
          token: USDC.address as `0x${string}`,
          to: resolvedAddress.displayAddress as `0x${string}`,
          from: clientAddress as `0x${string}`,
          message: note,
        };
        onPay(currencyRequest);

        closeModal();
      }
    }
  };

  const checkAddress = resolvedAddress?.displayAddress as `0x${string}` | undefined;
  console.log(checkAddress);

  const {
    isMaliciousAddress
  } = useHarpieValidateAddress(import.meta.env.VITE_HARPIE_KEY, resolvedAddress?.displayAddress as `0x${string}` | undefined)

  return (
    <Transition appear show={isOpen} as={Fragment}>

      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">

              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                {/* <HarpieAlert isFlagged={true}></HarpieAlert> */}

                <Dialog.Title
                  as="h3"
                  className="text-center text-xl font-bold leading-6 text-gray-700">
                  Request or pay money
                </Dialog.Title>
                {resolvedAddress?.displayAddress ? (
                  <div className="mt-8 flex flex-col items-center">
                    {resolvedAddress?.displayAddress && (
                      <Avatar {...avatarUrlProps} />
                    )}
                    {resolvedAddress?.displayAddress && (
                      <p className="mt-2 font-medium">
                        {resolvedAddress.displayAddress &&
                          resolvedAddress.walletAddress
                          ? resolvedAddress.displayAddress
                          : shortenAddress(resolvedAddress.displayAddress)}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-8 flex flex-col items-center">
                    <button className="relative hover:bg-gray-700 hover:-bg-opacity-80 rounded-full flex items-center justify-center overflow-hidden">
                      <div>
                        <Avatar />
                      </div>
                      <div className="absolute flex items-center justify-center w-full h-full bg-black bg-opacity-40 hover:bg-opacity-80">
                        <PlusCircleIcon width={16} height={16} fill="#ffff" />
                      </div>
                    </button>
                    <ContactsCombobox />
                  </div>
                )}
                <div className="mt-2 flex items-center">
                  <CurrencyInput
                    id="validationCustom01"
                    name="input-1"
                    value={value}
                    defaultValue={value}
                    onValueChange={handleOnValueChange}
                    prefix={prefix}
                    placeholder="$0.00"
                    step={1}
                    className="input:first-letter:text-sm min-w-[1px] p-0 text-4xl font-bold text-center w-auto border-0 focus:outline-none focus:border-none focus:shadow-none"
                    style={{
                      boxShadow: `unset`,
                    }}
                  />
                </div>
                <div className="pt-32">
                  <input
                    value={note}
                    onChange={(e: any) =>
                      onChangeNote && onChangeNote(e.target.value)
                    }
                    className="border-[1px] border-gray-400 rounded-md w-full h-12 px-2"
                    placeholder="What's this for?"
                  />
                </div>
                <div className="mt-2 flex gap-4">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handleCurrencyRequest}>
                    Request
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handlePayRequest}>
                    Pay
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
