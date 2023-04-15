import { NftCollectionServiceProvider } from "@minteeble/sdk";
import React from "react";

const NftCollectionServiceDecorator = (storyFn) => (
  <NftCollectionServiceProvider>{storyFn()}</NftCollectionServiceProvider>
);

export default NftCollectionServiceDecorator;
