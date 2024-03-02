import { useTranslation } from "react-i18next";
import type { VirtuosoHandle } from "react-virtuoso";
import { Virtuoso } from "react-virtuoso";
import { useMemo, useRef, useState } from "react";
import { useConsent } from "@xmtp/react-sdk";
import { useXmtpStore } from "../../../store/xmtp";
import { useHarpieValidateAddress } from "../../../hooks/useHarpieValidateAddress";
import { Button } from "../../ui/button";

interface FullConversationProps {
  messages?: Array<JSX.Element | null>;
  isLoading?: boolean;
  address: string;
}

const LoadingMessage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex align-center justify-center text-gray-500 font-regular text-sm animate-pulse">
      {t("messages.conversation_loading")}
    </div>
  );
};

const BeginningMessage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div
      className="text-gray-500 font-regular text-sm w-full py-2 text-center"
      data-testid="message-beginning-text">
      {t("messages.conversation_start")}
    </div>
  );
};

const AcceptOrDeny = ({ address }: { address: string }) => {
  const { t } = useTranslation();
  const { allow, deny } = useConsent();
  const activeTab = useXmtpStore((s) => s.activeTab);
  const changedConsentCount = useXmtpStore((s) => s.changedConsentCount);
  const { isMaliciousAddress } = useHarpieValidateAddress(
    import.meta.env.VITE_HARPIE_KEY,
    address as `0x${string}` | undefined,
  );

  const setChangedConsentCount = useXmtpStore((s) => s.setChangedConsentCount);

  const [modalOpen, setModalOpen] = useState(true);

  return activeTab === "requests" && modalOpen ? (
    <div
      className="bg-zinc-900 p-4 relative w-full flex flex-col justify-center items-center text-zinc-200 border-2 border-zinc-900"
      data-testid="accept_or_deny_container">
      {isMaliciousAddress ? (
        <div className="text-center">
          <div className="top-4 left-4 bg-red-500 text-red-100 px-2 py-1 rounded-sm">
            <p>
              Warning: Our system has detected that this wallet address has been
              hacked.
            </p>
            <p>Please proceed with caution.</p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="font-bold">{t("consent.new_message_request")}</h3>
          <p>{t("consent.new_message_request_description")}</p>
        </div>
      )}

      <div className="flex w-full justify-between p-3 gap-2">
        <Button
          type="button"
          className="w-full"
          onClick={() => {
            void allow([address]);
            setModalOpen(false);
            setChangedConsentCount(changedConsentCount + 1);
          }}>
          {t("consent.accept")}
        </Button>
        <Button
          type="button"
          className="w-full"
          variant="destructive"
          onClick={() => {
            void deny([address]);
            setModalOpen(false);
            setChangedConsentCount(changedConsentCount + 1);
          }}>
          {t("consent.block")}
        </Button>
      </div>
    </div>
  ) : null;
};

export const FullConversation = ({
  messages = [],
  isLoading = false,
  address,
}: FullConversationProps) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const filteredMessages = useMemo(() => {
    const filtered = messages.filter((msg) => msg !== null);
    return [
      isLoading ? (
        <LoadingMessage key="loading" />
      ) : (
        <BeginningMessage key="beginning" />
      ),
      ...filtered,
      <AcceptOrDeny key={address} address={address} />,
    ];
  }, [isLoading, messages, address]);

  console.log(filteredMessages);

  return (
    <>
      <Virtuoso
        alignToBottom
        data={filteredMessages}
        totalCount={filteredMessages.length}
        initialTopMostItemIndex={filteredMessages.length - 1}
        followOutput="auto"
        className="w-full h-full flex flex-col"
        itemContent={(index, message) => message}
        ref={virtuosoRef}
      />
    </>
  );
};
