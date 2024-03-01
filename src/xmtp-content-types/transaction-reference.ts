import { ContentTypeConfiguration } from "@xmtp/react-sdk";
import {
  ContentTypeTransactionReference,
  TransactionReferenceCodec,
} from "@xmtp/content-type-transaction-reference";

export const transactionReferenceContentTypeConfig: ContentTypeConfiguration = {
  codecs: [new TransactionReferenceCodec()],
  contentTypes: [ContentTypeTransactionReference.toString()],
  namespace: "evmmio", // Replace with the actual namespace you are using
  processors: {
    [ContentTypeTransactionReference.toString()]: [
      processTransactionReferenceRequest,
    ],
  },
  validators: {
    [ContentTypeTransactionReference.toString()]:
      isValidTransactionReferenceContent,
  },
};

function processTransactionReferenceRequest(content: any) {
  // Define how to process the multiply numbers content
  // Example: logging, storing, or manipulating the data
}

function isValidTransactionReferenceContent(content: any) {
  // Define validation logic for multiply numbers content
  // Example: checking if the numbers are valid, not null, etc.
  // TODO
  return true;
}
