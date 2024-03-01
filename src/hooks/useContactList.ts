import { useConsent } from "@xmtp/react-sdk";
import useListConversations from "./useListConversations";

export const useContactList = () => {
  const { isLoaded, isLoading, conversations } = useListConversations();
  const { isAllowed, isDenied } = useConsent();

  const contacts = conversations.filter((item) => isAllowed(item.peerAddress));

  return {
    contacts,
    isLoading,
    isLoaded,
  };
};
