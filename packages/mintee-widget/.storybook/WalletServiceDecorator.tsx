import { WalletServiceProvider } from "@minteeble/sdk";
import React from "react";

const WalletServiceDecorator = (storyFn) => (
  <WalletServiceProvider>{storyFn()}</WalletServiceProvider>
);

export default WalletServiceDecorator;
