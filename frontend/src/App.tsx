import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./index.css";
import "./App.css";

import Flow from "./Flow";
import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { chains, wagmiClient } from "./provider";

function App() {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <ConnectButton />
        </RainbowKitProvider>
      </WagmiConfig>
      <Flow />
    </>
  );
}

export default App;
