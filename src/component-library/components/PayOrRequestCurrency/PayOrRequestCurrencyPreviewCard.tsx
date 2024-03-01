import { CachedMessage } from "@xmtp/react-sdk";
import { CurrencyRequest } from "../../../xmtp-content-types/currency-request";

interface MessageContentControllerProps {
  message?: CachedMessage;
  isSelf: boolean;
  currencyRequest?: CurrencyRequest;
}

export const PayOrRequestCurrencyPreviewCard = ({
  isSelf,
  message,
}: MessageContentControllerProps) => {
  console.log({ message });
  return (
    <div className="relative m-8 w-fit">
      {isSelf ? "You sent a request to pay" : "You received a request to pay"}
    </div>
  );
};
