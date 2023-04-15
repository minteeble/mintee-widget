import { SmartContractServiceProvider } from "@minteeble/sdk";
import React from "react";

const SmartContractServiceDecorator = (storyFn) => (
  <SmartContractServiceProvider>{storyFn()}</SmartContractServiceProvider>
);

export default SmartContractServiceDecorator;
