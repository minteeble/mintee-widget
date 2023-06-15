/**
 * Copyright Minteeble 2023. All Rights Reserved.
 * Package: @minteeble/mintee-widget
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/licenses/MIT
 *
 * email:     minteeble@gmail.com
 * website:   https://minteeble.com
 */

import React from "react";

import { Story, Meta } from "@storybook/react";

import MinteeWidget from "./MinteeWidget";
import { MintWidgetProps, UseMinteeWidgetProps } from "./MinteeWidget.types";

export default {
  title: "MinteeWidget",
  component: MinteeWidget,
  argTypes: {},
} as Meta<typeof MinteeWidget>;

const Template: Story<MintWidgetProps> = (args) => <MinteeWidget {...args} />;

export const NormalERC721 = Template.bind({});
(NormalERC721.args as MintWidgetProps) = {
  chainName: "sepolia",
  collectionId: "1930be15-8fbe-4ab5-a4e7-02064b5bae5c",
};

export const NormalERC1155 = Template.bind({});
(NormalERC1155.args as MintWidgetProps) = {
  chainName: "sepolia",
  collectionId: "4705c57e-fb43-4ecb-b540-6d8c3ee60149",
  erc1155Id: "1",
};
