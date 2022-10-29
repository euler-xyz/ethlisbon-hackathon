import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./index.css";
import "./App.css";

import FlowBuilder from "./components/FlowBuilder";
import { ConnectButton, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { wagmiClient, chains } from "./provider";

function App() {
  return (
    <>
      <div className="connection-section">
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <ConnectButton />
          </RainbowKitProvider>
        </WagmiConfig>
      </div>

      <div className="flow-section">
        <FlowBuilder />
      </div>
    </>
  );
}

export default App;
