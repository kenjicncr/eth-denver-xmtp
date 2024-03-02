import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import { EmojiMatcher, useEmojiData } from "interweave-emoji";
import type { MouseEvent } from "react";
import { ContentTypeRemoteAttachment } from "@xmtp/content-type-remote-attachment";
import type { Reply } from "@xmtp/content-type-reply";
import { ContentTypeReply } from "@xmtp/content-type-reply";
import {
  ContentTypeTransactionReference,
  TransactionReferenceCodec,
} from "@xmtp/content-type-transaction-reference";

import {
  ContentTypeId,
  type CachedMessage,
  ContentTypeText,
} from "@xmtp/react-sdk";
import RemoteAttachmentMessageTile from "../component-library/components/RemoteAttachmentMessageTile/RemoteAttachmentMessageTile";
import { ContentTypeCurrencyRequest } from "../xmtp-content-types/currency-request";
import { PayOrRequestCurrencyPreviewCard } from "../component-library/components/PayOrRequestCurrency/PayOrRequestCurrencyPreviewCard";
import { PaidCurrencyPreviewCard } from "../component-library/components/PayOrRequestCurrency/PaidCurrencyPreviewCard";

interface MessageContentControllerProps {
  message: CachedMessage;
  isSelf: boolean;
}

const MessageContentController = ({
  message,
  isSelf,
}: MessageContentControllerProps) => {
  const [, source] = useEmojiData({
    compact: false,
    shortcodes: ["emojibase"],
  });

  const contentType = ContentTypeId.fromString(message.contentType);

  if (contentType.sameAs(ContentTypeText)) {
    const content = message.content as string;
    const isObject = typeof content === "object";
    if (isObject) {
      return (
        <PayOrRequestCurrencyPreviewCard message={message} isSelf={isSelf} />
      );
    }

    return (
      <span className="interweave-content" data-testid="message-tile-text">
        <Interweave
          content={content}
          newWindow
          escapeHtml
          onClick={(event: MouseEvent<HTMLDivElement>) =>
            event.stopPropagation()
          }
          matchers={[
            new UrlMatcher("url"),
            new EmojiMatcher("emoji", {
              convertEmoticon: true,
              convertShortcode: true,
              renderUnicode: true,
            }),
            // Commenting out email matching until this issue is resolved: https://github.com/milesj/interweave/issues/201
            // In the meantime, the experience still properly displays emails, just doesn't link to the expected `mailto:` view.
            // new EmailMatcher("email"),
          ]}
          emojiSource={source}
        />
      </span>
    );
  }

  if (contentType.sameAs(ContentTypeRemoteAttachment)) {
    return <RemoteAttachmentMessageTile message={message} isSelf={isSelf} />;
  }

  if (contentType.sameAs(ContentTypeReply)) {
    const reply = message.content as Reply;
    const newMessage = {
      ...message,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      content: reply.content,
      contentType: new ContentTypeId(reply.contentType).toString(),
    };

    return <MessageContentController message={newMessage} isSelf={isSelf} />;
  }

  // render currency request here
  if (contentType.sameAs(ContentTypeCurrencyRequest)) {
    return (
      <PayOrRequestCurrencyPreviewCard message={message} isSelf={isSelf} />
    );
  }

  if (contentType.sameAs(ContentTypeTransactionReference)) {
    return <PaidCurrencyPreviewCard message={message} isSelf={isSelf} />;
  }
  // message content type not supported, display fallback
  return <span>{message.contentFallback}</span>;
};

export default MessageContentController;
