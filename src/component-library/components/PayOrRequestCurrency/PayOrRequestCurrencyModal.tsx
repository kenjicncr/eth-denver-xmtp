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
import { ChainSelection } from "./ChainSelection";
import { AvatarUrlProps, ResolvedAddress } from "./types";
import { shortAddress } from "../../../helpers";
import { PayDestinatonAddress } from "./PayDestinatonAddress";

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
  resolvedAddress?: ResolvedAddress;
  /**
   * What are the props associated with the avatar?
   */
  avatarUrlProps?: AvatarUrlProps;
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
          from:
            resolvedAddress.displayAddress && resolvedAddress.walletAddress
              ? (resolvedAddress.walletAddress as `0x${string}`)
              : (resolvedAddress.displayAddress as `0x${string}`),
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
        console.log({ resolvedAddress });
        const currencyRequest: CurrencyRequest = {
          amount: parseUnits(value, USDC.decimals).toString(),
          chainId: 8453,
          token: USDC.address as `0x${string}`,
          to:
            resolvedAddress.displayAddress && resolvedAddress.walletAddress
              ? (resolvedAddress.walletAddress as `0x${string}`)
              : (resolvedAddress.displayAddress as `0x${string}`),
          from: clientAddress as `0x${string}`,
          message: note,
        };
        onPay(currencyRequest);

        closeModal();
      }
    }
  };

  const checkAddress = resolvedAddress?.displayAddress as
    | `0x${string}`
    | undefined;

  const { isMaliciousAddress } = useHarpieValidateAddress(
    import.meta.env.VITE_HARPIE_KEY,
    resolvedAddress?.displayAddress as `0x${string}` | undefined,
  );

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                <HarpieAlert isFlagged={isMaliciousAddress}></HarpieAlert>

                <Dialog.Title
                  as="h3"
                  className="text-center text-xl font-bold leading-6 text-zinc-100">
                  Request or pay money
                </Dialog.Title>
                <PayDestinatonAddress
                  resolvedAddress={resolvedAddress}
                  avatarUrlProps={avatarUrlProps}
                />
                <div className="flex justify-center">
                  <ChainSelection />
                </div>

                <div className="mt-12 flex items-center">
                  <CurrencyInput
                    id="validationCustom01"
                    name="input-1"
                    value={value}
                    defaultValue={value}
                    onValueChange={handleOnValueChange}
                    prefix={prefix}
                    placeholder="$0.00"
                    step={1}
                    className="bg-zinc-900 input:first-letter:text-sm min-w-[1px] p-0 text-4xl font-bold text-center w-auto border-0 focus:outline-none focus:border-none focus:shadow-none"
                    style={{
                      boxShadow: `unset`,
                    }}
                  />
                </div>
                <div className="pt-16">
                  <input
                    value={note}
                    onChange={(e: any) =>
                      onChangeNote && onChangeNote(e.target.value)
                    }
                    className="border-[1px] border-zinc-800 rounded-lg w-full h-12 px-2 bg-background"
                    placeholder="What's this for?"
                  />
                </div>
                <div className="mt-4 flex gap-4">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border-transparent bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handleCurrencyRequest}>
                    Request
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-white  px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
