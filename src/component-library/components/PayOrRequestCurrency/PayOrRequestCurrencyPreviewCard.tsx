import {
  CachedMessage,
  CachedMessageWithId,
  useReplies,
  useSendMessage,
} from "@xmtp/react-sdk";
import { getReplies } from "@xmtp/react-sdk";

import { CurrencyRequest } from "../../../xmtp-content-types/currency-request";
import {
  findMatchingReply,
  getTokenByAddress,
  getTokenlistByChainId,
} from "../../../tokens/utils";
import { useClient, useConversation } from "@xmtp/react-sdk";
import { ContentTypeReply, Reply } from "@xmtp/content-type-reply";
import { formatUnits } from "viem";

import { classNames } from "../../../helpers";
import { useXmtpStore } from "../../../store/xmtp";
import { useSendCurrency } from "../../../hooks/useSendCurrency";
import { TransactionReceipt } from "viem";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  TransactionReference,
  ContentTypeTransactionReference,
} from "@xmtp/content-type-transaction-reference";
import { Token } from "../../../tokens/types";
import useSelectedConversation from "../../../hooks/useSelectedConversation";

function getChainName(chainId: number) {
  switch (chainId) {
    case 1:
      return "Ethereum Mainnet";
    case 3:
      return "Ropsten Testnet";
    case 4:
      return "Rinkeby Testnet";
    case 8453:
      return "Base";
    // Add more cases for other chain ids
    default:
      return "Unknown Chain";
  }
}

interface MessageContentControllerProps {
  message?: CachedMessage;
  isSelf: boolean;
  onPayMessageClick?: (
    message: CachedMessage | undefined,
    currencyRequest: CurrencyRequest | null,
  ) => void;
  onSuccessPayment?: (data: TransactionReceipt) => void;
}

export const PayOrRequestCurrencyPreviewCard = ({
  isSelf,
  message,
  onPayMessageClick,
  onSuccessPayment,
}: MessageContentControllerProps) => {
  const content = message?.content;
  if (!content.amount) return null;
  const currencyRequest = content as CurrencyRequest | null;
  const [isPaid, setIsPaid] = useState(false);
  const replies = useReplies(message);

  const sendCurrency = useSendCurrency({
    amount: currencyRequest?.amount,
    chainId: currencyRequest?.chainId,
    tokenAddress: currencyRequest?.token,
    from: currencyRequest?.from,
    to: currencyRequest?.to,
    onSendSuccess: (data) => {
      console.log("succesfully sent  payment", data);
      // void send({ hash: data.transactionHash });
      onSuccessPayment && onSuccessPayment(data);
      void send(data);
    },
  });

  const setActiveMessage = useXmtpStore((state) => state.setActiveMessage);
  const { sendMessage, isLoading, error } = useSendMessage();
  const conversation = useSelectedConversation();

  const tokenList = getTokenlistByChainId(currencyRequest?.chainId!);
  const token: Token | undefined | null = tokenList
    ? getTokenByAddress(tokenList, currencyRequest?.token as `0x${string}`)
    : null;

  useEffect(() => {
    if (replies && token) {
      const matchingReply = findMatchingReply(replies, currencyRequest, token);
      if (matchingReply) {
        setIsPaid(true);
      } else {
        setIsPaid(false);
      }
    }
  }, [replies, token]);

  const send = useCallback(
    (data: TransactionReceipt) => {
      if (
        currencyRequest &&
        data?.transactionHash &&
        currencyRequest.token &&
        token &&
        conversation
      ) {
        const transactionReference: TransactionReference = {
          namespace: "eip155",
          networkId: currencyRequest.chainId,
          reference: data.transactionHash,
          metadata: {
            amount: Number(currencyRequest.amount),
            currency: token?.symbol,
            fromAddress: currencyRequest.from,
            toAddress: currencyRequest.to,
            transactionType: "transfer",
            decimals: token?.decimals,
          },
        };

        const replyContent: Reply = {
          reference: message?.xmtpID!,
          contentType: ContentTypeTransactionReference,
          content: transactionReference,
        };
        void sendMessage(conversation, replyContent, ContentTypeReply);
      }
    },
    [conversation, replies, token, currencyRequest],
  );

  const handleOnPayMessageClick = (
    message: CachedMessage | undefined,
    currencyRequest: CurrencyRequest | null,
  ) => {
    if (message) {
      setActiveMessage(message as CachedMessageWithId);
      onPayMessageClick && onPayMessageClick(message, currencyRequest);
      sendCurrency.write?.();
    }
  };

  const isSenderRequestingCurrency =
    message?.senderAddress === currencyRequest?.to;

  const isDollar = token?.symbol === "USDC" || token?.symbol === "USDT";

  const amount =
    currencyRequest !== undefined
      ? Number(
          formatUnits(BigInt(currencyRequest?.amount || "0"), token?.decimals!),
        ).toLocaleString()
      : "0";

  return (
    <div className={classNames("h-48", "flex", "flex-col", "items-between")}>
      <div className="flex items-center mx-2 mt-2 text-sm font-medium">
        <svg
          width="16"
          height="16"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 16C0 7.16344 7.19457 0 16.0695 0C24.9387 0 31.7912 7.0303 31.9999 15.9307C31.9999 18.7706 31.026 21.1602 28.5912 23.4113C26.5338 25.3135 23.026 25.5931 20.4523 24.1732C18.6154 23.1181 17.1996 20.8711 16 19.2208L13.7739 22.6147H8.97389L13.4956 15.9305L9.11302 9.35065H14.0521L16.0347 12.7446L17.9826 9.35065H22.9565L18.4347 15.9307C18.4347 15.9307 20.5912 19.2208 21.7739 20.5022C22.9565 21.7836 25.113 21.8182 26.5043 20.4329C28.034 18.9098 28.3764 17.6971 28.3825 15.9307C28.4064 9.09397 22.9524 3.60173 16.0695 3.60173C9.19239 3.60173 3.61738 9.15263 3.61738 16C3.61738 22.8474 9.19239 28.3983 16.0695 28.3983C17.0208 28.3983 17.9325 28.3187 18.8173 28.1212L19.6521 31.619C18.3931 31.9001 17.3062 32 16.0695 32C7.19457 32 0 24.8366 0 16Z"
            fill="#FFFFFF"
          />
        </svg>
        <p className="ml-1">Pay</p>
      </div>
      <div className="relative w-full h-full flex flex-col items-between p-4 px-12 pt-8">
        {isSelf && <p> You requested</p>}
        <div className="flex-1">
          <p className="text-4xl text-center">
            <span className="font-bold">
              {isDollar ? `$${amount}` : `${amount} ${token?.symbol}`}
            </span>
          </p>
          {currencyRequest && (
            <p className="text-center text-sm">
              {getChainName(currencyRequest?.chainId)}
            </p>
          )}
        </div>
        <div>
          {isSenderRequestingCurrency && !isSelf && (
            <button
              type="button"
              className={classNames(
                "w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium  hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                isPaid
                  ? "bg-background text-white hover:bg-background"
                  : " bg-white text-black",
              )}
              onClick={() => handleOnPayMessageClick(message, currencyRequest)}
              disabled={isPaid}>
              {isPaid ? `Paid` : `Pay`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
