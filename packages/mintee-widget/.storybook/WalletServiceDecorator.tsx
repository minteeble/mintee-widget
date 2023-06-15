import { WalletServiceProvider } from "@minteeble/sdk";
import React from "react";
import { ToastContainer } from "react-toastify";

const WalletServiceDecorator = (storyFn) => (
  <WalletServiceProvider>
    {storyFn()}
    <ToastContainer />
  </WalletServiceProvider>
);

export default WalletServiceDecorator;
