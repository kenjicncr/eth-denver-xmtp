import { ContentTypeId } from "@xmtp/xmtp-js";
import type { ContentCodec, EncodedContent } from "@xmtp/xmtp-js";

import { ContentTypeConfiguration } from "@xmtp/react-sdk";

export const ContentTypeCurrencyRequest = new ContentTypeId({
  authorityId: "evmmo.io",
  typeId: "currency-request",
  versionMajor: 0,
  versionMinor: 1,
});

export class CurrencyRequest {
  public amount: string;
  public chainId: number;
  public token: `0x${string}`;
  public from: `0x${string}`;
  public to: `0x${string}`;
  public message: string;

  constructor(
    amount: string,
    chainId: number,
    token: `0x${string}`,
    from: `0x${string}`,
    to: `0x${string}`,
    message: string,
  ) {
    this.amount = amount;
    this.chainId = chainId;
    this.token = token;
    this.from = from;
    this.to = to;
    this.message = message;
  }
}

export class ContentTypeSendCurrencyCodec
  implements ContentCodec<CurrencyRequest>
{
  get contentType(): ContentTypeId {
    return ContentTypeCurrencyRequest;
  }
  encode(req: any): EncodedContent {
    const { amount, chainId, token, from, to, message } = req;
    return {
      type: ContentTypeCurrencyRequest,
      parameters: {},
      content: new TextEncoder().encode(
        JSON.stringify({ amount, chainId, token, from, to, message }),
      ),
    };
  }

  // The decode method decodes the byte array, parses the string into numbers (num1, num2), and returns their product
  decode(encodedContent: EncodedContent): CurrencyRequest {
    const decodedContent = new TextDecoder().decode(encodedContent.content);
    const { amount, chainId, token, from, to, message } =
      JSON.parse(decodedContent);
    return new CurrencyRequest(amount, chainId, token, from, to, message);
  }

  fallback(content: CurrencyRequest): string | undefined {
    return `Can’t display currency request content types. Request parameters: ${JSON.stringify(
      content,
    )}`;
    // return undefined to indicate that this content type should not be displayed if it's not supported by a client
  }
}

export const CurrencyRequestContentTypeConfig: ContentTypeConfiguration = {
  codecs: [new ContentTypeSendCurrencyCodec()],
  contentTypes: [ContentTypeCurrencyRequest.toString()],
  namespace: "EVMMOIO", // Replace with the actual namespace you are using
  processors: {
    [ContentTypeCurrencyRequest.toString()]: [processCurrencyRequest],
  },
  validators: {
    [ContentTypeCurrencyRequest.toString()]: isValidCurrencyRequestContent,
  },
};

function processCurrencyRequest(content: any) {
  // Define how to process the multiply numbers content
  // Example: logging, storing, or manipulating the data
}

function isValidCurrencyRequestContent(content: any) {
  // Define validation logic for multiply numbers content
  // Example: checking if the numbers are valid, not null, etc.
  // TODO
  return true;
}
