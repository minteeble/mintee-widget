import "!style-loader!css-loader!sass-loader!../src/style/main.scss";

import React from "react";
import { Preview } from "@storybook/react";

// import { Preview } from '@storybook/react';
import WalletServiceDecorator from "./WalletServiceDecorator";
import SmartContractServiceDecorator from "./SmartContractServiceDecorator";
import NftCollectionServiceDecorator from "./NftCollectionServiceDecorator";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    NftCollectionServiceDecorator,
    SmartContractServiceDecorator,
    WalletServiceDecorator,
  ],
};

export default preview;
