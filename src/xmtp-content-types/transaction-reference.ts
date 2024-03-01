import { ContentTypeConfiguration } from "@xmtp/react-sdk";
import {
  ContentTypeTransactionReference,
  TransactionReferenceCodec,
} from "@xmtp/content-type-transaction-reference";

type TransactionReferenceTransactionType = "transfer";

export interface TransactionReference {
  /**
   * Optional namespace for the networkId
   */
  namespace: string;
  /**
   * The networkId for the transaction, in decimal or hexidecimal format
   */
  networkId: number;
  /**
   * The transaction hash
   */
  reference: string;
  /**
   * Optional metadata object
   */
  metadata: {
    transactionType: TransactionReferenceTransactionType;
    currency: string;
    amount: number; // In integer format, this represents 1 USDC (100000/10^6)
    decimals: number; // Specifies that the currency uses 6 decimal places
    fromAddress: string;
    toAddress: string;
  };
}

export const transactionReferenceContentTypeConfig: ContentTypeConfiguration = {
  codecs: [new TransactionReferenceCodec()],
  contentTypes: [ContentTypeTransactionReference.toString()],
  namespace: "eip155", // Replace with the actual namespace you are using
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
