import { t } from "i18next";
import { useState, Fragment, useRef, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

import CurrencyInput, {
  CurrencyInputProps,
  CurrencyInputOnChangeValues,
} from "react-currency-input-field";
import { RecipientAddress } from "../../../store/xmtp";
import { Avatar } from "../Avatar/Avatar";

const shortenAddress = (address: string, chars = 4): string => {
  const prefix = address.slice(0, chars);
  const suffix = address.slice(-chars);
  return `${prefix}...${suffix}`;
};

interface SendOrRequestCurrencyProps {
  onSend?: () => void;
  onRequest?: () => void;
  onOpen?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
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
}
export const SendOrRequestCurrency = ({
  isOpen,
  onClose,
  onOpen,
  onRequest,
  onSend,
  resolvedAddress,
  avatarUrlProps,
}: SendOrRequestCurrencyProps) => {
  const prefix = "$";
  const [value, setValue] = useState<string | number>(0);
  const [className, setClassName] = useState("");

  const [values, setValues] = useState<CurrencyInputOnChangeValues>();
  const [errorMessage, setErrorMessage] = useState("");
  const [currencyInputWidth, setCurrencyInputWidth] = useState(0);

  const currencyInputRef = useRef(null);

  useEffect(() => {
    if (currencyInputRef.current) {
      //@ts-ignore
      setCurrencyInputWidth(currencyInputRef.current.offsetWidth);
    }
  }, [value]);

  /**
   * Handle validation
   */
  const handleOnValueChange: CurrencyInputProps["onValueChange"] = (
    _value,
    name,
    _values,
  ) => {
    // _values is only for demo purposes in this example
    setValues(_values);

    if (!_value) {
      setClassName("");
      setValue("");
      return;
    }

    setClassName("is-valid");
    setValue(_value);
  };

  const closeModal = () => {
    onClose && onClose();
  };
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
                <Dialog.Title
                  as="h3"
                  className="text-center text-xl font-bold leading-6 text-gray-700">
                  Request or pay money
                </Dialog.Title>
                <div className="mt-8 flex flex-col items-center">
                  {resolvedAddress?.displayAddress && (
                    <Avatar {...avatarUrlProps} />
                  )}
                  {resolvedAddress?.displayAddress && (
                    <p className="mt-2 font-medium">
                      {shortenAddress(resolvedAddress.displayAddress)}
                    </p>
                  )}
                </div>
                <div className="mt-2 flex items-center">
                  <CurrencyInput
                    id="validationCustom01"
                    name="input-1"
                    value={value}
                    defaultValue={value}
                    onValueChange={handleOnValueChange}
                    prefix={prefix}
                    step={1}
                    className="input:first-letter:text-sm min-w-[1px] p-0 text-4xl font-bold text-center w-auto border-0 focus:outline-none focus:border-none focus:shadow-none"
                    style={{
                      boxShadow: `unset`,
                    }}
                  />
                </div>
                <div className="pt-32">
                  <input
                    className="border-[1px] border-gray-400 rounded-md w-full h-12 px-2"
                    placeholder="What's this for?"
                  />
                </div>
                <div className="mt-2 flex gap-4">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}>
                    Request
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}>
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
