import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

export const { chains, provider } = configureChains(
	[chain.mainnet, chain.goerli],
	[
	  alchemyProvider({ apiKey: import.meta.env.ALCHEMY_ID }),
	  publicProvider()
	]
  );
  
  const { connectors } = getDefaultWallets({
	appName: 'My RainbowKit App',
	chains
  });
  
  export const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider
  })
