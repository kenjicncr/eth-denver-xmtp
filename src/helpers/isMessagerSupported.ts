import { ContentTypeRemoteAttachment } from "@xmtp/content-type-remote-attachment";
import type { CachedMessageWithId } from "@xmtp/react-sdk";
import { ContentTypeId, ContentTypeText } from "@xmtp/react-sdk";
import { ContentTypeScreenEffect } from "@xmtp/experimental-content-type-screen-effect";
import { ContentTypeCurrencyRequest } from "../xmtp-content-types/currency-request";
import { ContentTypeTransactionReference } from "@xmtp/content-type-transaction-reference";
/**
 * Determines if a message is supported by the app
 */
export const isMessageSupported = (message: CachedMessageWithId) => {
  const contentType = ContentTypeId.fromString(message.contentType);
  return (
    contentType.sameAs(ContentTypeText) ||
    contentType.sameAs(ContentTypeRemoteAttachment) ||
    contentType.sameAs(ContentTypeScreenEffect) ||
    contentType.sameAs(ContentTypeCurrencyRequest) ||
    contentType.sameAs(ContentTypeTransactionReference)
  );
};
