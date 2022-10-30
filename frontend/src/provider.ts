import "@rainbow-me/rainbowkit/styles.css";

import { connectorsForWallets, getDefaultWallets, RainbowKitProvider} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { metaMaskWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";

export const { chains, provider } = configureChains(
  [chain.mainnet, chain.goerli],
  [alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID || "h0Vnzg4K2U330ks8dZNKwr7dTjiTClDh" }), publicProvider()]
);

// const { connectors } = getDefaultWallets({
//   appName: "My RainbowKit App",
//   chains,
// });

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
		metaMaskWallet({ chains }),
		// walletConnectWallet({chains})
    ],
  },
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
