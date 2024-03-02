import "./polyfills";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { trustWallet } from "@rainbow-me/rainbowkit/wallets";
import { publicProvider } from "wagmi/providers/public";
import {
  attachmentContentTypeConfig,
  reactionContentTypeConfig,
  replyContentTypeConfig,
  XMTPProvider,
} from "@xmtp/react-sdk";
import { mainnet, base, moonbeam } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import {
  ContentTypeScreenEffect,
  ScreenEffectCodec,
} from "@xmtp/experimental-content-type-screen-effect";
import App from "./controllers/AppController";
import { isAppEnvDemo } from "./helpers";
import { mockConnector } from "./helpers/mockConnector";
// TODO, this is probably re-exported by wagmi, maybe we use that
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { CurrencyRequestContentTypeConfig } from "./xmtp-content-types/currency-request";
import { transactionReferenceContentTypeConfig } from "./xmtp-content-types/transaction-reference";
import { ThemeProvider } from "./component-library/components/ThemeProvider/ThemeProvider";

// Increment with any schema change; e.g. adding support for a new content type
const DB_VERSION = 6;

export const ScreenEffectCodecInstance = new ScreenEffectCodec();

const customConfig = {
  codecs: [ScreenEffectCodecInstance],
  contentTypes: [ContentTypeScreenEffect.toString()],
  namespace: "screenEffects",
};

const contentTypeConfigs = [
  attachmentContentTypeConfig,
  reactionContentTypeConfig,
  replyContentTypeConfig,
  customConfig,
  CurrencyRequestContentTypeConfig,
  transactionReferenceContentTypeConfig,
];

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, base, moonbeam],
  [
    infuraProvider({ apiKey: import.meta.env.VITE_INFURA_ID ?? "" }),
    publicProvider(),
  ],
);

// Required field as of WalletConnect v2.
// Replace with your project id: https://www.rainbowkit.com/docs/migration-guide#2-supply-a-walletconnect-cloud-projectid
const projectId = import.meta.env.VITE_PROJECT_ID || "ADD_PROJECT_ID_HERE";
const appName = "XMTP Inbox Web";

const { wallets } = getDefaultWallets({
  appName,
  projectId,
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [trustWallet({ projectId, chains })],
  },
]);

const wagmiDemoConfig = createConfig({
  autoConnect: true,
  connectors: [mockConnector],
  publicClient,
  webSocketPublicClient,
});
wagmiDemoConfig;

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root") as HTMLElement).render(
  <WagmiConfig config={isAppEnvDemo() ? wagmiDemoConfig : wagmiConfig}>
    <RainbowKitProvider chains={chains}>
      <QueryClientProvider client={queryClient}>
        <StrictMode>
          <XMTPProvider
            contentTypeConfigs={contentTypeConfigs}
            dbVersion={DB_VERSION}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <App />
            </ThemeProvider>
          </XMTPProvider>
        </StrictMode>
      </QueryClientProvider>
    </RainbowKitProvider>
  </WagmiConfig>,
);
