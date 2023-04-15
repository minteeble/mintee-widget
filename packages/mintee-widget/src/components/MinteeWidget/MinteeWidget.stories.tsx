/**
 * Copyright Minteeble 2023. All Rights Reserved.
 * Node module: @minteeble/ui-components
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/licenses/MIT
 *
 * email:     minteeble@gmail.com
 * website:   https://minteeble.com
 */

import React from "react";

import { Story, Meta } from "@storybook/react";

import MinteeWidget from "./MinteeWidget";
import { MintWidgetProps } from "./MinteeWidget.types";

export default {
  title: "MinteeWidget",
  component: MinteeWidget,
  argTypes: {},
} as Meta<typeof MinteeWidget>;

const Template: Story<MintWidgetProps> = (args) => <MinteeWidget {...args} />;

export const SimplePoweredByMinteeble = Template.bind({});
SimplePoweredByMinteeble.args = {
  chainName: "sepolia",
  collectionId: "087b8459-544a-46e0-bb10-c13d8d67727a",
};
