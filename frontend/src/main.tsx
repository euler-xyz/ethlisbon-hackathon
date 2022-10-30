import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiConfig } from "wagmi";
import App from "./App";
import "./index.css";
import { wagmiClient, chains } from "./provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
