import { useState } from "react";
import { CurrencyRequest } from "../xmtp-content-types/currency-request";
import useListConversations from "./useListConversations";
import { useConsent } from "@xmtp/react-sdk";
import { Token } from "../tokens/types";
import { getTokenByAddress, getTokenlistByChainId } from "../tokens/utils";

interface UseCurrencyRequestModal {
  receiverAddress: `0x${string}` | null;
}

export const useCurrencyRequestModal = ({
  receiverAddress,
}: UseCurrencyRequestModal) => {
  const [currencyRequestValue, setCurrencyRequestValue] = useState("");
  const [currencyRequestNote, setCurrencyRequestNote] = useState("");
  const [currencyRequestType, setCurrencyRequestType] = useState<
    "request" | "pay" | null
  >(null);
  const [selectedReceiver, setSelectedReceiver] = useState<
    `0x${string}` | null
  >(receiverAddress);
  const [currencyRequest, setCurrencyRequest] =
    useState<CurrencyRequest | null>(null);
  const [isOpen, setIsModalOpen] = useState(false);

  const chainId = currencyRequest?.chainId;
  const tokenList = chainId ? getTokenlistByChainId(chainId) : [];
  const currencyRequestToken: Token | undefined | null = tokenList
    ? getTokenByAddress(tokenList, currencyRequest?.token as `0x${string}`)
    : null;

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
    currencyRequestType,
    setCurrencyRequestType,
    currencyRequestToken,
  };
};
