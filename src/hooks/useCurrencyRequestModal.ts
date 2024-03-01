import { useState } from "react";
import { CurrencyRequest } from "../xmtp-content-types/currency-request";
import useListConversations from "./useListConversations";
import { useConsent } from "@xmtp/react-sdk";

interface UseCurrencyRequestModal {
  receiverAddress: `0x${string}` | null;
}

export const useCurrencyRequestModal = ({
  receiverAddress,
}: UseCurrencyRequestModal) => {
  const [currencyRequestValue, setCurrencyRequestValue] = useState("");
  const [currencyRequestNote, setCurrencyRequestNote] = useState("");
  const [selectedReceiver, setSelectedReceiver] = useState<
    `0x${string}` | null
  >(receiverAddress);
  const [currencyRequest, setCurrencyRequest] =
    useState<CurrencyRequest | null>(null);
  const [isOpen, setIsModalOpen] = useState(false);

  return {
    currencyRequestValue,
    setCurrencyRequestValue,
    currencyRequestNote,
    setCurrencyRequestNote,
    currencyRequest,
    setCurrencyRequest,
    selectedReceiver,
    setSelectedReceiver,
    isOpen,
    setIsModalOpen,
  };
};
